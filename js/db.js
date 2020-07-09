let DB_NAME = "football-score"
let DB_VERSION = 1

let dbPromised = idb.open(DB_NAME, DB_VERSION, function(upgradeDb) {
  if(!upgradeDb.objectStoreNames.contains("competition")){    
    let articlesObjectStore = upgradeDb.createObjectStore("competition", {
      keyPath: "competition.id"
    });
    articlesObjectStore.createIndex("name", "competition.name", { unique: true });
  }
});

function saveCompetition(competition) {
  dbPromised
    .then(function(db) {
      let tx = db.transaction("competition", "readwrite");
      let store = tx.objectStore("competition");
      store.add(competition);
      return tx.complete;
    })
    .then(function() {
      console.log("Competition is successfully saved.");
    })
    .catch()
}

function deleteCompetition(id) {
  dbPromised
    .then(function(db) {
      let tx = db.transaction("competition", "readwrite");
      let store = tx.objectStore("competition");
      store.delete(id);
      location.reload();
      return tx.complete;
    })
    .then(function() {
      console.log("Competition has been deleted.");
    });
  
}

function getAllCompetition() {
  return new Promise((resolve,reject)=>{
    dbPromised.then(db=>{
      let tx = db.transaction("competition","readonly");
      let store = tx.objectStore("competition");
      return store.getAll();
    })
    .then(competition=>{
      resolve(competition);
    });
  });
}

function getCompetitionByIdDB(id) {
	return new Promise((resolve,reject) =>{
		dbPromised
			.then(db=>{
        let tx = db.transaction("competition","readonly");
        let store = tx.objectStore("competition");
			return store.get(parseInt(id));
			})  
			.then(competition=>{
			resolve(competition);
      })
	})
}