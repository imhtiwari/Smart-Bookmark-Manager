const urlInput = document.getElementById("urlInput");
const addBtn = document.getElementById("addBookmark");
const delAll = document.getElementById("deleteAll");
const list = document.getElementById("bookmarkList");
const search = document.getElementById("searchInput");

function normalize(url){
  return new URL(url.startsWith("http")?url:"https://"+url).href;
}

function exists(url){
  return !!list.querySelector(`a[href="${url}"]`);
}

function save(){
  localStorage.setItem("bookmarks",
    JSON.stringify([...list.querySelectorAll("a")].map(a=>a.href)));
}

function load(){
  const data = JSON.parse(localStorage.getItem("bookmarks")||"[]");
  data.forEach(addBookmarkToUI);
}

function addBookmarkToUI(url){
  const li=document.createElement("li");
  li.innerHTML=`
   <a href="${url}" target="_blank">${url}</a>
   <div>
     <button class="edit">✏️</button>
     <button class="delete">❌</button>
   </div>`;
  list.appendChild(li);
  li.querySelector(".delete").onclick=()=>{li.remove();save();}
  li.querySelector(".edit").onclick=()=>{
    let n=prompt("Edit URL:",url);
    if(!n)return;
    n=normalize(n);
    if(exists(n))return alert("Already exists");
    li.querySelector("a").href=n;
    li.querySelector("a").textContent=n;
    save();
  }
}

addBtn.onclick=()=>{
  if(!urlInput.value)return;
  const url=normalize(urlInput.value.trim());
  if(exists(url))return alert("Already exists");
  addBookmarkToUI(url);
  save();
  urlInput.value="";
};

delAll.onclick=()=>{list.innerHTML="";save();}

search.oninput=()=>{
  const t=search.value.toLowerCase();
  [...list.children].forEach(li=>{
    li.style.display=li.textContent.toLowerCase().includes(t)?"flex":"none";
  });
}

load();



