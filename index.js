addEventListener('fetch', event => {

  event.respondWith(handleRequest(event.request))
})


const custom_title = 'This is custom title'
const custom_h1_title = "This is custom h1 title"
const custom_p_desc = "This is custom description"
const custom_a_url = "Visit my Linkedin Profle"
//Class
class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    const attribute = element.getAttribute("id")
    if (attribute=="title"){
      element.setInnerContent(custom_h1_title)
    }
    else if (attribute=="description"){
      element.setInnerContent(custom_p_desc)
    }
    else if (attribute=="url"){
      element.setInnerContent(custom_a_url)
      element.setAttribute("href","https://www.linkedin.com/in/pawan-madanan-89450723/")
    }
    else if (element.tagName=="title"){
      element.setInnerContent(custom_title)
    }
  }
}const rewriter = new HTMLRewriter()
  .on('title', new AttributeRewriter('title'))
  .on('h1#title', new AttributeRewriter('title'))
  .on('p#description', new AttributeRewriter('description'))
  .on('a#url', new AttributeRewriter('url'))

/**
* Respond with hello worker text
* @param {Request} request
*/
flag = true;
const url = "https://cfw-takehome.developers.workers.dev/api/variants";
async function handleRequest(request) {
  let thing =	{
    method: 'GET',
    headers: new Headers({
    }),
  }
  cookies = request.headers.get('Cookie') || ""
  var cookieHasWhichVariant = 3;
  if(cookies.includes("variant_type=1")){
      cookieHasWhichVariant = 1
  }else if (cookies.includes("variant_type=2")) {
      cookieHasWhichVariant = 2
  }
  return fetch(url, thing)
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      return response.text()
      throw new Error('Something went wrong on api server!');
    }
  })
.then(response => {
    if(cookieHasWhichVariant == 1){

      f=1
     return fetch(response.variants[0])
     }
     else if(cookieHasWhichVariant == 2){
       f=2
      return fetch(response.variants[1])
      }
      else{
    if(flag){
      flag =!flag
      f = 1;
    return fetch(response.variants[0])
  }else {
    flag =!flag
      f = 2;
    return fetch(response.variants[1])
  }
}
  }).then(response =>{
    esponse = new Response(response.body, response)
    esponse.headers.set("Set-Cookie", "variant_type=".concat(f))
    return rewriter.transform(esponse)
  })
  .catch(error => {
    console.error(error);
  });
}
