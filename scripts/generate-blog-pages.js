const fs = require('fs');
const path = require('path');

const posts = [
    {
        filename: 'understanding-liver-health.html',
        postTitle: 'Understanding Liver Health',
        postImage: '../../assets/images/blog/1.jpg',
        postDate: 'Oct 9, 2025',
        postContent: '<p>The liver is a vital organ that performs hundreds of functions. This post breaks down the basics of liver health and how to maintain it.</p>'
    },
    {
        filename: 'diet-for-a-healthy-liver.html',
        postTitle: 'Diet for a Healthy Liver',
        postImage: '../../assets/images/blog/2.jpg',
        postDate: 'Oct 10, 2025',
        postContent: '<p>What you eat has a direct impact on your liver. Learn about the best foods to support liver function and what to avoid.</p>'
    }
];

const blogIndexLayout = path.join(__dirname, '..', 'src', 'components', 'blog-index-layout.html');
const blogPostLayout = path.join(__dirname, '..', 'src', 'components', 'blog-post-layout.html');
const outputDir = path.join(__dirname, '..', 'public', 'blog');

// Generate Blog Index
fs.readFile(blogIndexLayout, 'utf8', (err, layout) => {
    if (err) return console.error(err);

    let postEntries = '';
    posts.forEach(post => {
        postEntries += `
            <div class="col-sm-12 col-md-6 col-lg-4">
                <div class="post-item">
                    <div class="post__img">
                        <a href="${post.filename}">
                            <img src="${post.postImage.replace('../../', '../')}" alt="post image">
                        </a>
                    </div>
                    <div class="post__content">
                        <h4 class="post__title"><a href="${post.filename}">${post.postTitle}</a></h4>
                        <p class="post__desc">${post.postContent.replace(/<p>|<\/p>/g, "").substring(0, 100)}...</p>
                        <a href="${post.filename}" class="btn btn__secondary btn__link">
                            <span>Read More</span><i class="icon-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>`;
    });

    const output = layout.replace('{{BLOG_POSTS}}', postEntries);
    fs.writeFile(path.join(outputDir, 'index.html'), output, 'utf8', err => {
        if (err) console.error(err);
        else console.log('Successfully created blog index.html');
    });
});

// Generate Blog Posts
fs.readFile(blogPostLayout, 'utf8', (err, layout) => {
    if (err) return console.error(err);

    posts.forEach(post => {
        let output = layout;
        for (const key in post) {
            output = output.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), post[key]);
        }
        fs.writeFile(path.join(outputDir, post.filename), output, 'utf8', err => {
            if (err) console.error(err);
            else console.log(`Successfully created ${post.filename}`);
        });
    });
});
