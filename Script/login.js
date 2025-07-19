function startGame() {
  const name1 = document.getElementById("player1").value || "player 1";
  const name2 = document.getElementById("player2").value || "player 2";
  const gridSize = parseInt(document.getElementById("boxes").value) || 5;

  if (gridSize < 3 || gridSize > 10) {
    alert("❌ The Grid Size must be Within  3 - 10 ");
    return;
  }

  localStorage.setItem("player1", name1);
  localStorage.setItem("player2", name2);
  localStorage.setItem("boxes", gridSize);
  window.location.href = "game.html";
}
