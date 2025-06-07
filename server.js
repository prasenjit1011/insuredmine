let dtd = new Date;
console.clear();
console.log("Hello, World!!");
console.log(`${dtd.getMinutes()} | ${dtd.getSeconds()} | ${dtd.getMilliseconds()}`);
const fetchUser = () => {
  return new Promise((resolve) => {
    let dtd = new Date;
    console.log(`${dtd.getMinutes()} | ${dtd.getSeconds()} | ${dtd.getMilliseconds()}`);
    setTimeout(() => resolve("User data"), 100000);
  });
};

const fetchPosts = () => {
  return new Promise((resolve) => {
    let dtd = new Date;
    console.log(`${dtd.getMinutes()} | ${dtd.getSeconds()} | ${dtd.getMilliseconds()}`);
    setTimeout(() => resolve("Posts data"), 15000);
  });
};

const fetchComments = () => {    


    //function mytest(){console.log('---hello---');}


  return new Promise((myresolve, myreject, mytest) => {
    let dtd = new Date;
    console.log(`${dtd.getMinutes()} | ${dtd.getSeconds()} | ${dtd.getMilliseconds()}`);
    setTimeout(() => myreject("Comments data"), 50000);
  });
};

// Use Promise.all to run them in parallel
Promise.any([fetchUser(), fetchPosts(), fetchComments()])
  .then((results) => {
    console.log("All data fetched:");
    console.log("User:", results[0]);
    console.log("Posts:", results[1]);
    console.log("Comments:", results[2]);
  })
  .catch((err) => {
    console.error("Error fetching data:", err);
  });