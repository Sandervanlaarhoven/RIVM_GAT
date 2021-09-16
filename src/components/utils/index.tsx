import logo from "../../images/logo.jpg";

/**
 * @description Capitalises the first letter in a String (word of sentence)
 * @param text
*/
export function catitaliseFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * @description Swaps two elements in an array
 * @param array
 * @param indexA
 * @param indexB
*/
export function swapElementsInArray(array: any[], indexA: number, indexB: number) {
  var tmp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = tmp;
  return array;
}

/**
 * @description replaces an element in an array with another element
 * @param array
 * @param element
 * @param indexToReplace
*/
export function replaceElementsInArray(array: any[], element: any, indexToReplace: number) {
  array[indexToReplace] = element;
  return array;
}


/**
 * @description sends a notification to the users browser
 * @param title
 * @param body
 * @param url
*/
export function sendnotification(title: string, body: string, url: string) {
  const notification = new Notification(title, {
    body,
    icon: logo
  })
  notification.onclick = () => {
    window.location.href = url
  }
}
