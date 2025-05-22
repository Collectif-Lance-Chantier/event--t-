    const plane = document.getElementById("plane");
    const game = document.getElementById("game");
    const distanceDisplay = document.getElementById("distance");
    const coinsDisplay = document.getElementById("coins");

    let planeX = 50;
    let planeY = window.innerHeight / 2;
    let targetX = planeX;
    let targetY = planeY;
    let distance = 0;
    let coins = 0;

    let isInvincible = false;
    let hasMagnet = false;
    let speedMultiplier = 1;
    let bonusShown = false;

    function updatePlanePosition() {
      plane.style.left = planeX + "px";
      plane.style.top = planeY + "px";
    }

    let keysPressed = {};
    document.addEventListener("keydown", e => keysPressed[e.key] = true);
    document.addEventListener("keyup", e => keysPressed[e.key] = false);

    function animatePlane() {
      const speed = 4;

      if (keysPressed["ArrowUp"]) targetY = Math.max(0, targetY - speed);
      if (keysPressed["ArrowDown"]) targetY = Math.min(window.innerHeight - 40, targetY + speed);
      if (keysPressed["ArrowLeft"]) targetX = Math.max(0, targetX - speed);
      if (keysPressed["ArrowRight"]) targetX = Math.min(window.innerWidth - 60, targetX + speed);

      planeX += (targetX - planeX) * 0.1;
      planeY += (targetY - planeY) * 0.1;

      updatePlanePosition();
      requestAnimationFrame(animatePlane);
    }

    function createCloud() {
      const cloud = document.createElement("div");
      cloud.classList.add("cloud");
      cloud.style.top = Math.random() * (window.innerHeight - 50) + "px";
      cloud.style.left = window.innerWidth + "px";
      game.appendChild(cloud);

      let cloudX = window.innerWidth;
      const move = setInterval(() => {
        cloudX -= 4;
        cloud.style.left = cloudX + "px";

        const planeRect = plane.getBoundingClientRect();
        const cloudRect = cloud.getBoundingClientRect();

        if (!isInvincible &&
            planeRect.left < cloudRect.right &&
            planeRect.right > cloudRect.left &&
            planeRect.top < cloudRect.bottom &&
            planeRect.bottom > cloudRect.top) {
          alert("💥 Collision avec un nuage !\nDistance parcourue : " + distance + " m");
          location.reload();
        }

        if (cloudX < -100) {
          cloud.remove();
          clearInterval(move);
        }
      }, 16);
    }

    function createBonus(type) {
      const bonus = document.createElement("div");
      bonus.classList.add("bonus", type);
      bonus.style.top = Math.random() * (window.innerHeight - 50) + "px";
      bonus.style.left = window.innerWidth + "px";
      game.appendChild(bonus);

      let bonusX = window.innerWidth;
      const move = setInterval(() => {
        bonusX -= 4;
        bonus.style.left = bonusX + "px";

        const planeRect = plane.getBoundingClientRect();
        const bonusRect = bonus.getBoundingClientRect();

        if (planeRect.left < bonusRect.right &&
            planeRect.right > bonusRect.left &&
            planeRect.top < bonusRect.bottom &&
            planeRect.bottom > bonusRect.top) {
          bonus.remove();
          clearInterval(move);
          if (type === "star") activateStarBonus();
          if (type === "magnet") activateMagnetBonus();
        }

        if (bonusX < -100) {
          bonus.remove();
          clearInterval(move);
        }
      }, 16);
    }

    function activateStarBonus() {
      isInvincible = true;
      speedMultiplier = 2;
      plane.classList.add("invincible");

      setTimeout(() => {
        isInvincible = false;
        speedMultiplier = 1;
        plane.classList.remove("invincible");
      }, 5000);
    }

    function activateMagnetBonus() {
      hasMagnet = true;
      plane.classList.add("magnet");

      setTimeout(() => {
        hasMagnet = false;
        plane.classList.remove("magnet");
      }, 5000);
    }

    function createCoin() {
      const coin = document.createElement("div");
      coin.classList.add("coin");
      coin.style.top = Math.random() * (window.innerHeight - 30) + "px";
      coin.style.left = window.innerWidth + "px";
      game.appendChild(coin);

      let coinX = window.innerWidth;
      const move = setInterval(() => {
        coinX -= 4;
        coin.style.left = coinX + "px";

        const planeRect = plane.getBoundingClientRect();
        const coinRect = coin.getBoundingClientRect();

        if (planeRect.left < coinRect.right &&
            planeRect.right > coinRect.left &&
            planeRect.top < coinRect.bottom &&
            planeRect.bottom > coinRect.top) {
          coin.remove();
          clearInterval(move);
          coins++;
          coinsDisplay.textContent = coins;
        }

        if (hasMagnet) {
          const planeCenterY = planeRect.top + planeRect.height / 2;
          const coinCenterY = coinRect.top + coinRect.height / 2;
          const deltaY = planeCenterY - coinCenterY;
          coin.style.top = parseFloat(coin.style.top) + deltaY * 0.05 + "px";
        }

        if (coinX < -50) {
          coin.remove();
          clearInterval(move);
        }
      }, 16);
    }

    // Lancement des éléments
    setInterval(createCloud, 1500);
    setInterval(createCoin, 1000);
    setInterval(() => createBonus("magnet"), 15000);

    setInterval(() => {
      distance += 10 * speedMultiplier;
      distanceDisplay.textContent = distance;

      if (!bonusShown && distance >= 2500 && distance <= 3000) {
        createBonus("star");
        bonusShown = true;
      }
    }, 200);

    animatePlane();