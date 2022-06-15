
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
// import { minify } from 'html-minifier';

const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/ClashDisplay-Variable-optimized.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

const dodos = [
    'https://dodonut.pages.dev/static/dodo/1.svg',
    'https://dodonut.pages.dev/static/dodo/2.svg',
    'https://dodonut.pages.dev/static/dodo/3.svg'
]

function getCss(theme: string, fontSize: string, background: string) {
    let foreground = 'black';

    if (theme === 'dark') {
        // background = 'black';
        foreground = 'white';
    }

    return `
    @font-face {
        font-family: 'Clash Display';
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format("woff2");
        font-weight: 400 700;
        font-style: normal;
        font-display: block;
        unicode-range: U+0-FF, U+131, U+152, U+153, U+2BB, U+2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+2764, U+FE0F, U+FEFF, U+FFFD, U+1F3FB, U+1F44D;
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: #${background};
        height: 100vh;
        display: flex;
        text-align: left;
        padding-left: 150px;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: flex-end;
        align-content: flex-end;
    }

    .logo {
        margin: 0;
        max-width: 500px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 40px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Clash Display', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.45;
        font-weight: 500;
        max-width: 70%;
        width: 100%;
        margin: 60px 0 150px;
    }

    .heading-dodo--1 {
        max-width: 55%;
    }

    .heading p {
        margin: 0;
    }

    .heading strong {
        font-weight: 600;
    }
    
    .dodo-img {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: auto;
    }

    .dodo-img--1 {
        height: 100%;
        bottom: 0;
        width: auto;
        right: -100px;
    }
    
    .dodo-img--2 {
        width: 600px;
        height: auto;
    }

    .dodo-img--3 {
        width: 800px;
        height: auto;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, dodo, background, md, fontSize, images, widths, heights } = parsedReq;
    const dodoUrl = dodos[parseInt(dodo) - 1];

    const html = `<!DOCTYPE html>
    <html>
        <meta charset="utf-8">
        <title>Generated Image</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            ${getCss(theme, fontSize, background)}
        </style>
        <body>
            <div style="width: 100%;margin-top:auto;">
                <div class="logo-wrapper">
                    ${images.map((img, i) =>
                        getPlusSign(i) + getImage(img, widths[i], heights[i])
                    ).join('')}
                </div>
                <div class="heading heading-dodo--${dodo}">${emojify(
                    md ? marked(text) : sanitizeHtml(text)
                )}
                </div>
                <img src="${dodoUrl}" alt="dodo" class="dodo-img dodo-img--${dodo}" />
            </div>
        </body>
    </html>`;

    return html;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
