require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');


// Notion client setup
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








app.use((req, res, next) => {
  if (
    req.method === 'GET' &&
    !req.path.endsWith('.html') &&
    !req.path.includes('.') // skip assets like .css, .js, .png, etc.
  ) {
    const filePath = path.join(__dirname, 'public', req.path + '.html');
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  next();
});

app.use(express.static('public'));







app.get('/api/blog/:slug', async (req, res) => {
  const { slug } = req.params;
  console.log('Looking for slug:', slug);

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
    });

    const matchedPage = response.results.find(page => {
      const fullSlug = page.properties['URL Slug']?.url || '';
      const pageSlug = fullSlug.split('/').pop(); // normalize
      return pageSlug.toLowerCase() === slug.toLowerCase();
    });

    if (!matchedPage) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Now fetch the page content (block children)
    const blocks = await notion.blocks.children.list({
      block_id: matchedPage.id,
    });

    const content = blocks.results.map(renderBlock).join('');

    res.json({
      title: matchedPage.properties.Name?.title?.[0]?.plain_text || '',
      date: matchedPage.properties.Date?.date?.start || '',
      slug,
      content,
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post', details: error.message });
  }
});



app.get('/api/blog', async (req, res) => {
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

    // Fetch and format each blog post including its content blocks
    const posts = await Promise.all(
      response.results.map(async (page) => {
        const props = page.properties;

        const title = props.Name?.title?.[0]?.plain_text || 'Untitled';
        const date = props.Date?.date?.start || null;
        const slug = props['URL Slug']?.url || '';
        const summary = props.Content?.rich_text?.[0]?.plain_text?.slice(0, 150) || '';

        // 🧠 Fetch the content blocks for this page
        const blocks = await notion.blocks.children.list({ block_id: page.id });
        const content = blocks.results.map(renderBlock).join('');

        return { id: page.id, title, date, slug, summary, content };
      })
    );

    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts', details: error.message });
  }
});








app.get('/perspectives/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/post.html'));
});






app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/perspectives.html'));  // Adjust path as needed
});







app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

