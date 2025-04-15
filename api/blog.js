const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

function renderRichText(richTextArray) {
  return richTextArray.map(textObj => {
    const { text, annotations, href, plain_text } = textObj;
    let content = text?.content || plain_text;

    if (href || text?.link?.url) {
      const link = href || text.link.url;
      content = `<a href="${link}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }

    if (annotations) {
      if (annotations.bold) content = `<strong>${content}</strong>`;
      if (annotations.italic) content = `<em>${content}</em>`;
      if (annotations.code) content = `<code>${content}</code>`;
      if (annotations.underline) content = `<u>${content}</u>`;
      if (annotations.strikethrough) content = `<s>${content}</s>`;
    }

    return content;
  }).join('');
}

function renderBlock(block) {
  const { type } = block;
  const textArray = block[type]?.rich_text || [];
  const htmlContent = renderRichText(textArray);

  switch (type) {
    case 'paragraph':
      return `<p>${htmlContent}</p>`;
    case 'heading_1':
      return `<h1>${htmlContent}</h1>`;
    case 'heading_2':
      return `<h2>${htmlContent}</h2>`;
    case 'heading_3':
      return `<h3>${htmlContent}</h3>`;
    case 'bulleted_list_item':
      return `<ul><li>${htmlContent}</li></ul>`;
    case 'numbered_list_item':
      return `<ul><li>${htmlContent}</li></ul>`;
    case 'image':
      const imageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url;
      return `<div class="notion-image-wrapper"><img src="${imageUrl}" alt="Blog image" class="notion-image" /></div>`;
    default:
      return '';
  }
}

module.exports = async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map(async (page) => {
        const props = page.properties;
        const title = props.Name?.title?.[0]?.plain_text || 'Untitled';
        const date = props.Date?.date?.start || null;
        const slug = props['URL Slug']?.url || '';
        const summary = props.Content?.rich_text?.[0]?.plain_text?.slice(0, 150) || '';
        const blocks = await notion.blocks.children.list({ block_id: page.id });
        const content = blocks.results.map(renderBlock).join('');
        return { id: page.id, title, date, slug, summary, content };
      })
    );

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts', details: error.message });
  }
}; 