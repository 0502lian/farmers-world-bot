(async () => {
  // Time to repeat an action for action with error  
  const TIME_TO_RESET = 1 * 60 * 60 * 1000;

  let result = {};
  let needResetResult = false;
  setTimeout(() => {
    needResetResult = true;
  }, TIME_TO_RESET);

  const mapBtn = document.querySelector(".navbar-group--icon[alt='Map']");
  mapBtn.click();

  while (1) {
    if (needResetResult) {
      console.log("need reset");
      result = {};
      needResetResult = false;
      setTimeout(() => {
        needResetResult = true;
      }, TIME_TO_RESET);
    }

    for (let mapId = 0; mapId < 4; ++mapId) {
      if (typeof result[mapId] === "undefined") result[mapId] = {};

      await new Promise((res) => setTimeout(res, 5e3));

      const map = document.querySelectorAll(".map-container-bg")[mapId];

      if (map.style.filter === "grayscale(1)") continue;

      map.click();

      await new Promise((res) => setTimeout(res, 5e3));

      for (const [indexItem, item] of document
        .querySelectorAll(".vertical-carousel-container img")
        .entries()) {
        if (typeof result[mapId][indexItem] === "undefined")
          result[mapId][indexItem] = 0;

        item.click();

        await new Promise((res) => setTimeout(res, 1e3));

        const buttonMine = document.querySelector(
          ".info-section .plain-button"
        );
        const timeToEnd = document.querySelector(
          ".info-section .info-time"
        ).innerText;
        if (![...buttonMine.classList].includes("disabled") && timeToEnd === '00:00:00') {
          const boxdaylyLimit = [
            ...document.querySelectorAll(".info-label"),
          ].find((el) => el.innerText.includes("Daily Claim Limit"));
          if (boxdaylyLimit) {
            const dailyLimit = boxdaylyLimit.querySelector("div").innerText;
            if (result[mapId][indexItem] >= dailyLimit) continue;
          }

          buttonMine.click();
          ++result[mapId][indexItem];

          await new Promise((res) => setTimeout(res, 1e3));

          // If map with mining
          if (mapId === 0) {
            while (
              !document.querySelector(".modal__button-group .plain-button")
            ) {
              await new Promise((res) => setTimeout(res, 5e3));
            }

            await new Promise((res) => setTimeout(res, 5e3));

            document
              .querySelector(".modal__button-group .plain-button")
              .click();

            await new Promise((res) => setTimeout(res, 1e3));

            // Repair instruments
            const buttonRepair = document.querySelectorAll(
              ".info-section .plain-button"
            )[1];
            const quality = eval(
              document.querySelector(".card-number").innerText
            );
            if (
              ![...buttonRepair.classList].includes("disabled") &&
              quality < 0.5
            ) {
              buttonRepair.click();
              await new Promise((res) => setTimeout(res, 1e3));
            }
          }

          await new Promise((res) => setTimeout(res, 1e4));

          const currentEnergy = +document.querySelectorAll(
            ".resource-number div"
          )[3].innerText;
          const currentFish =
            +document.querySelectorAll(".resource-number")[2].innerText;
          if (currentEnergy < 200 && currentFish > 20) {
            document.querySelector(".resource-energy img").click();
            await new Promise((res) => setTimeout(res, 1e3));

            for (let i = 0; i++ < 20; ) {
              document.querySelector(".image-button[alt='Plus Icon']").click();
              await new Promise((res) => setTimeout(res, 5e2));
            }

            document.querySelector(".modal-wrapper .plain-button").click();

            await new Promise((res) => setTimeout(res, 2e4));
          }
        }
      }

      mapBtn.click();
    }
  }
})();
