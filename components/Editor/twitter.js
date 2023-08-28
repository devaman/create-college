function addTag(className='', id) {

  return `<blockquote class="twitter-tweet" data-dnt="true" 
  data-aria-polite="assert" ><a href="${id}">Tweet here</a></blockquote>`;

}

function isTwitterLink(href) {
  return href.indexOf('twitter:') === 0;
}

const remarkableTwitter = (md, config = {}) => {
  const originalLinkOpenRenderer = md.renderer.rules.link_open;
  const originalLinkCloseRenderer = md.renderer.rules.link_close;
  const classname = 'tweet-embed-' + parseInt(Math.random() + 10000);
  let id = null;
  md.renderer.rules.link_open = (tokens, idx, options, env) => {
    const href = tokens[idx].href;

    if (isTwitterLink(href)) {
      env.twitter = true;
      id = href
      let link = id.split(':');
      link = link[1] + ":" + link[2]
      let string =  addTag(classname, link);
     
      return string;
    }
    return originalLinkOpenRenderer(tokens, idx, options, env);
  };

  md.renderer.rules.link_close = (tokens, idx, options, env) => {
    // console.log(document.getElementsByClassName(classname)[0]?document.getElementsByClassName(classname)[0].childElementCount<1:false);
    if (env.twitter) {

      env.twitter = false;
    }

    return originalLinkCloseRenderer(tokens, idx, options, env);
  };

};

module.exports = remarkableTwitter;
