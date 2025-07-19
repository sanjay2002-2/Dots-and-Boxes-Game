const winner = localStorage.getItem("winner") || "No winner";
    document.getElementById("winner-name").textContent = ` Winner: ${winner} 👑`;

    function playAgain() {
      localStorage.removeItem("player1");
      localStorage.removeItem("player2");
      localStorage.removeItem("winner");
      localStorage.clear();
      window.location.href = "index.html";
    }