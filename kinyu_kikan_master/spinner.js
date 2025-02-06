/*******************************************************************************
 *** spinner.js
 ******************************************************************************/

(() => {
  if (!window.KAIZEN) {
    window.KAIZEN = {};
  }

	window.KAIZEN.spinner = {};
	window.KAIZEN.spinner.show = () => {
		if (document.getElementById("kz-spin") === null) {
			const spin_div = document.createElement("div");
						spin_div.id = "kz-spin";
			const spin_bg_div = document.createElement("div");
						spin_bg_div.id = "kz-spin-bg";
			document.body.appendChild(spin_div);
			document.body.appendChild(spin_bg_div);

			spin_div.style.position = "fixed";
			spin_div.style.top = "50%";
			spin_div.style.left = "50%";
			spin_div.style.transform = "translate(-50%, -50%)";
			spin_div.style.backgroundColor = "none";
			spin_div.style.padding = "26px";
			spin_div.style.borderRadius = "4px";
			spin_div.style.zIndex = "510";

			spin_bg_div.style.position = "fixed";
			spin_bg_div.style.top = "0";
			spin_bg_div.style.left = "0";
			spin_bg_div.style.width = "100%";
			spin_bg_div.style.height = "100%";
			spin_bg_div.style.backgroundColor = "#000";
			spin_bg_div.style.opacity = "0.4";
			spin_bg_div.style.filter = "alpha(opacity=50)";
			spin_bg_div.style.zIndex = "500";

			const opts = {
				lines: 12,
				length: 65,
				width: 31,
				radius: 68,
				scale: 0.55,
				corners: 1,
				speed: 1,
				rotate: 19,
				fadeColor: "transparent",
				color: "#FFF"
			};
			new Spinner(opts).spin(spin_div);
		}
		document.getElementById("kz-spin").style.display = "block";
		document.getElementById("kz-spin-bg").style.display = "block";
	}

	window.KAIZEN.spinner.hide = () => {
		document.getElementById("kz-spin").style.display = "none";
		document.getElementById("kz-spin-bg").style.display = "none";
	};
})();