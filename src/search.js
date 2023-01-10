import rawData from './data';

export default function searchTree(obj, predicate, path) {
  if (predicate(obj)) {
    //if search is found return, add the object to the path and return it
    path.push(obj);
    return path;
  } else if (obj.children) {
    for (var i = 0; i < obj.children.length; i++) {
      path.push(obj); // we assume this path is the right one
      var found = searchTree(obj.children[i], predicate, path);
      if (found) {
        // we were right, this should return the bubbled-up path from the first if statement
        return found;
      } else {
        //we were wrong, remove this parent from the path and continue iterating
        path.pop();
      }
    }
  } else {
    // not the right object, return false so it will continue to iterate in the loop
    return false;
  }
}
