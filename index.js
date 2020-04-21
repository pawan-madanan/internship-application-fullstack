/*
Fetch event listener
*/
addEventListener('fetch', event => {

  event.respondWith(handleRequest(event.request))
})


const custom_title = 'This is custom title'
const custom_h1_title = "This is custom h1 title"
const custom_p_desc = "This is custom description"
const custom_a_url = "Visit my Linkedin Profle"
/*
This class will rewrite HTML tag contents
*/
class CustomHTMLRewriter {
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
.on('title', new CustomHTMLRewriter('title'))
.on('h1#title', new CustomHTMLRewriter('title'))
.on('p#description', new CustomHTMLRewriter('description'))
.on('a#url', new CustomHTMLRewriter('url'))



flagForVariantSwitch = true;
const url = "https://cfw-takehome.developers.workers.dev/api/variants";
/**
* Respond with URL.
* if a user visits first time, then will land on any of the variant among the 2 varitants.
* If the user is not a first time visitor then, based the cookie information, will be displayed
* the same variant.
* @param {Request} request
*/
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
  // Call the variants API
  return fetch(url, thing)
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      return response.text()
      throw new Error('Sorry, There was an Error. Please check again later.');
    }
  })
  .then(response => {
    if(cookieHasWhichVariant == 1){
      temp=1
      // Call the variants API 1
      return fetch(response.variants[0])
    }
    else if(cookieHasWhichVariant == 2){
      temp=2
      // Call the variants API  2
      return fetch(response.variants[1])
    }
    else{
      if(flagForVariantSwitch){
        flagForVariantSwitch =!flagForVariantSwitch
        temp = 1;
        // Call the variants API 1
        return fetch(response.variants[0])
      }else {
        flagForVariantSwitch =!flagForVariantSwitch
        temp = 2;
        // Call the variants API 2
        return fetch(response.variants[1])
      }
    }
  }).then(response =>{
    esponse = new Response(response.body, response)
    // Set the cookie with variant type that the user visited
    esponse.headers.set("Set-Cookie", "variant_type=".concat(temp))
    return rewriter.transform(esponse)
  })
  .catch(error => {
    console.error(error);
  });
}
