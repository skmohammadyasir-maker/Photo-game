// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

let user = null;
let score = 0;

// Login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => startGame(res.user))
    .catch(err => {
      // Create account if not exists
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => startGame(res.user))
        .catch(e => alert(e.message));
    });
}

// Start game
function startGame(u) {
  user = u;
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('gameDiv').style.display = 'block';
  document.getElementById('welcome').innerText = `Welcome, ${user.email}`;
  createBoard();
  loadLeaderboard();
}

// Simple tile game logic
function createBoard() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  for(let i=1;i<=8;i++) {
    const tile = document.createElement('div');
    tile.className='tile';
    tile.innerText=i; // Replace with image if needed
    tile.onclick = () => {
      score += 10;
      document.getElementById('score').innerText = score;
      updateScore();
    }
    board.appendChild(tile);
  }
}

// Update Firebase score
function updateScore() {
  firebase.database().ref('scores/'+user.uid).set({
    name: user.email,
    score: score
  });
  loadLeaderboard();
}

// Load leaderboard
function loadLeaderboard() {
  firebase.database().ref('scores').orderByChild('score').limitToLast(10).once('value', snapshot => {
    const lb = document.getElementById('leaderboard');
    lb.innerHTML='';
    const arr = [];
    snapshot.forEach(child => arr.push(child.val()));
    arr.sort((a,b)=>b.score-a.score);
    arr.forEach(item=>{
      const li = document.createElement('li');
      li.innerText = `${item.name}: ${item.score}`;
      lb.appendChild(li);
    });
  });
}
