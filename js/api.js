const base_url = "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/";

// Definisikan modul moment bahasa indonesia
moment.locale("id");

// Modal load dari cache
const noConnection = `
	<div class="modal-content">
		<h4>
			<i class="material-icons">signal_cellular_off</i>
			Connection Failed
		</h4>
		<p>Unable to connect to the server.</p>
	</div>
	<div class="modal-footer">
		<a class="modal-close waves-effect waves-blue btn blue">Alright.</a>
	</div>
`;

// Option untuk fetch api dengan header token
const options = {
	method: "GET",
	withCredentials: true,
	headers: {
		"X-Auth-Token": "52e5eccc8e5b45dfb755b7a27e22dc64",
	}
}

function loadMatchesToday(data,todayCompetition) {
	data.matches.map(function (team) {
		let time = moment(team.utcDate).format("D MM")
		let now = moment().format("D MM")

		if(time==now){			
			let scoreHomeTeam = 0;
			let scoreAwayTeam = 0;
			let winner = team.score.winner;
			let finishFlag = false;
	
			// Format jam tanding
			let utcDate = moment(team.utcDate).format("HH:MM");
			utcDate = utcDate.slice(0, -1) + '0';
	
			if (winner != null) {
				scoreHomeTeam = team.score.fullTime.homeTeam + team.score.extraTime.homeTeam;
				scoreAwayTeam = team.score.fullTime.awayTeam + team.score.extraTime.awayTeam;
				if (team.score.penalties.homeTeam!=null) {
					scoreHomeTeam = team.score.penalties.homeTeam;
					scoreAwayTeam = team.score.penalties.awayTeam;
				}
	
				finishFlag = true;
			}
	
			if (finishFlag == true) {
				utcDate = "FT"
			}
	
			todayCompetition += `
				<tr>
					<td>${utcDate}</td>
					<td colspan="2" style="text-align:left">
						${team.homeTeam.name}
						<br> 
						${team.awayTeam.name}
					</td>
					<td></td>
					<td>${scoreHomeTeam} <br> ${scoreAwayTeam}</td>
				</tr>
			`;
		
		}
	});

	// Masukkan hasil api ke dalam tabel body
	document.getElementById("today").innerHTML += todayCompetition;

	// Buat isi detail 
	const lastUpdated = moment(data.competition.lastUpdated).format("LLLL")
	const detail = `
		<h5>Data per ${lastUpdated}</h5>
	`;

	// Masukkan detail
	document.getElementById("detail").innerHTML = detail;
}

function loadHome(data,status=false) {
	let tableTemplate = `
		<table class="centered highlight striped">
			<tbody id="today">
			</tbody>
		</table>
	`;
	// Masukkan template tabel header dengan mereplace gambar loading 
	document.getElementById("loading").innerHTML = tableTemplate;

	let listCompetition = new Array();
	data.matches.map(function (competition) {
		if (competition.status != "POSTPONED") {
			let flag = false;
			for (let i = 0; i < listCompetition.length; i++) {
				let value = listCompetition[i].competition.name;
				if (value == competition.competition.name) {
					flag = true;
				}
			}
			if (flag == false) {
				// Masukkan ke list
				listCompetition.push(competition);

				// Deklarasikan id competition 
				const id = competition.competition.id;
				let time = moment().format("D MMM")
				let todayCompetition = `
					<tr class="card-panel blue">
						<td colspan="3" class="white-text">
							${competition.competition.name} (${competition.competition.area.name})
						</td>
						<td class="white-text">
							${time}
						</td>
						<td>
							<a id="competitionName" href="./about.html?id=${id}">
								<i class="material-icons">keyboard_arrow_right</i>
							</a>
						</td>
					</tr>
				`;

				// Mengambil tanggal hari ini
				let from = moment().subtract(1,'days').format("YYYY-MM-DD");
				let now = moment().format("YYYY-MM-DD");

				// Mengambil data list pertandingan
				// Ambil data dari caches
				if ('caches' in window&&status==false) {
					caches.match(base_url + "competitions/" + id + "/matches?dateFrom=" + from + "&&dateTo=" + now,options).then(response => {
						if (response) {
							response.json().then(data => {
								loadMatchesToday(data,todayCompetition)
							})
							// Munculkan popup 
							$(document).ready(() => {
								$('#modal').modal("open");
							});
						}else{
							fetch(base_url + "competitions/" + id + "/matches?dateFrom=" + from + "&&dateTo=" + now, options)
							.then(status)
							.then(json)
							.then(function (data) {
								console.log("Fetch data from server")
								loadMatchesToday(data,todayCompetition)
							});
						}
					})
				}
				// Ambil data dari API
				else{
					fetch(base_url + "competitions/" + id + "/matches?dateFrom=" + from + "&&dateTo=" + now, options)
						.then(status)
						.then(json)
						.then(function (data) {
							console.log("Fetch data from server")
							loadMatchesToday(data,todayCompetition)
						});
				}
			}
		};
	});
}

function loadTeam(data) {
	let tableTemplate = `
		<table class="centered highlight striped">
			<thead class="blue white-text">
				<tr>
					<th>Position</th>
					<th>Team Name</th>
					<th>Total Played Games<br> (Won-Draw-Lost)</th>
					<th>Points</th>
					<th>Goals Made</th>
					<th>Being target of goals</th>
				</tr>
			</thead>
			<tbody id="content">
			</tbody>
		</table>
	`;

	// Masukkan template tabel header dengan mereplace gambar loading 
	document.getElementById("loading").innerHTML = tableTemplate;

	let content = "";
	data.standings[0].table.map(function (team) {
		content += `
			<tr>
				<td>${team.position}</td>
				<td>${team.team.name}</td>
				<td>${team.playedGames} (${team.won}-${team.draw}-${team.lost})</td>
				<td>${team.points}</td>
				<td>${team.goalsFor}</td>
				<td>${team.goalsAgainst}</td>
			</tr>
		`;
	});
	// Masukkan hasil api ke dalam tabel body
	document.getElementById("content").innerHTML = content;

	// Buat judul 
	document.getElementById("title").innerHTML = `List of ${data.competition.name} Teams`;

	// Buat isi detail 
	const lastUpdated = moment(data.competition.lastUpdated).format("LLLL")
	const detail = `
		<h5>Data per ${lastUpdated}</h5>
	`;

	// Masukkan detail
	document.getElementById("detail").innerHTML = detail;
}

// User ingin load dari server halaman Home
function loadFromServerHome() {
	fetch(base_url + "matches", options)
		.then(status)
		.then(json)
		.then(function (data) {
			console.log("Fetch data from server")
			loadHome(data,true)
		})
		.catch(() => {
			// Munculkan popup 
			$(document).ready(() => {
				$('#modal').html(noConnection);
				$('#modal').modal("open");
			})
		});
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
	if (response.status !== 200) {
		console.log("Error : " + response.status);
		// Method reject() akan membuat blok catch terpanggil
		return Promise.reject(new Error(response.statusText));
	} else {
		// Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
		return Promise.resolve(response);
	}
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
	return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
	// Parameter error berasal dari Promise.reject()
	console.log("Error : " + error);
}

// Blok kode untuk mengambil list kompetisi hari ini
function getTodayCompetition() {
	// Ambil data dari caches
	if ('caches' in window) {
		caches.match(base_url + "matches").then(response => {
			if (response) {
				console.log(response)
				response.json().then(data => {
					loadHome(data)
				});
				// Munculkan popup 
				$(document).ready(() => {
					$('#modal').modal("open");
				});
			}
			// Jika response undefined (saat pertama kali)
			else{
				loadFromServerHome();
			}
		})
	}
	// Ambil data dari API
	else{
		loadFromServerHome();
	}
}

// Blok kode untuk mengambil list tim dari sebuah kompetisi
function getCompetitionById(flag=false) {
	return new Promise(function (resolve, reject) {
		// Ambil nilai query parameter (?id=)
		const urlParams = new URLSearchParams(window.location.search);
		const idParam = urlParams.get("id");
		// Ambil data dari caches 
		if ('caches' in window && flag == false) {
			caches.match(base_url + "competitions/" + idParam + "/standings").then(response => {
				if (response) {
					response.json().then(data => {
						console.log("Fetch data from caches")
						loadTeam(data)

						// Simpan ke db
						resolve(data);
					})
					// Munculkan popup 
					$(document).ready(() => {
						$('#modal').modal("open");
					});
				}else{
					// Jika response undefined (saat pertama kali)
					fetch(base_url + "competitions/" + idParam + "/standings", options)
						.then(status)
						.then(json)
						.then(function (data) {
							console.log("Fetch data from server")
							loadTeam(data)
							resolve(data)
						})
						.catch((error) => {
							// Munculkan popup 
							console.log(error)
							$(document).ready(() => {
								$('#modal').html(noConnection);
								console.log("by ID no connection")
								$('#modal').modal("open");
							})
						});
				}
			});
		}
		// Ambil data dari API
		else{
			fetch(base_url + "competitions/" + idParam + "/standings", options)
				.then(status)
				.then(json)
				.then(function (data) {
					console.log("Fetch data from server")
					loadTeam(data)
					resolve(data)
				})
				.catch((error) => {
					// Munculkan popup 
					console.log(error)
					$(document).ready(() => {
						$('#modal').html(noConnection);
						console.log("by ID no connection")
						$('#modal').modal("open");
					})
				});
		}
	})
}

// Blok kode untuk mengambil list kompetisi yang disimpan di DB
function getSavedCompetition() {
	getAllCompetition().then(function (data) {
		// Jika tidak ada nilai di DB
		if(data.length==0){
			document.getElementById("loading").innerHTML = `
				<img src="/img/empty.svg" alt="" style="width: 50%;">
				<h5>Your Favourite List is empty.</h5>
			`;
		}
		// Jika ada nilai di DB
		else if(data.length>0){
			let tableTemplate = `
				<table class="centered highlight striped">
					<tbody id="today">
					</tbody>
				</table>
			`;
			// Masukkan template tabel header dengan mereplace gambar loading 
			document.getElementById("loading").innerHTML = tableTemplate;
	
			data.map((competition)=>{
				// Deklarasikan id competition 
				const id = competition.competition.id;
				let time = moment().format("D MMM")
				let todayCompetition = `
					<tr class="card-panel blue">
						<td>
							<a class="btn-floating red" id="delete" onclick="deleteCompetition(${id})">
								<i class="material-icons">delete</i>
							</a>
						</td>
						<td class="white-text">
							${competition.competition.name} (${competition.competition.area.name})
						</td>
						<td class="white-text">
							${time}
						</td>
						<td>
							<a id="competitionName" href="./about.html?id=${id}&saved=true">
								<i class="material-icons">keyboard_arrow_right</i>
							</a>
						</td>
					</tr>
					<tr><td></td><td></td><td></td></tr>
				`;
				document.getElementById("today").innerHTML += todayCompetition;		
			})
		}
	});
}

// Blok kode untuk mengambil detail DB
function getSavedCompetitionById() {
	let urlParams = new URLSearchParams(window.location.search);
	let idParam = urlParams.get("id");

	getCompetitionByIdDB(idParam).then(data=>{
		loadTeam(data)
	})
}

