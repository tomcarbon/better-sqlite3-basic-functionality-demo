const Database = require('better-sqlite3');

let db;
const dbName = "catDatabase.db";
const myTable = `
   CREATE TABLE IF NOT EXISTS cats (
      name varchar(255) UNIQUE PRIMARY KEY,
      age int
)`;


function createNewDatabase () {
	db = new Database(dbName, { verbose: console.log });
}

function createTheTable () {
	// create a new table if it does not already exist
	const createTable = db.prepare(myTable);
	createTable.run();
}

function selectAllCats() {
	// select what we have from the table:
	const z = db.prepare('SELECT * FROM cats').all();
	return (z);
}

function selectOneCat(name) {
	// select what we have from the table:
	const z = db.prepare(`SELECT * FROM cats WHERE name = '${name}'`).all();
	return (z);
}

function insertOneCat (name, age) {
	try {
		const insert = db.prepare(`INSERT INTO cats (name, age) VALUES('${name}', ${age} )`);
		insert.run();
	} catch (err) {
		console.log(err);
		console.error("ERROR with INSERT (one cat). Probably a dupe. continuing.");
	}
}

function insertManyCats () {
	try {
		const insert = db.prepare('INSERT INTO cats (name, age) VALUES(@name, @age)');
		const insertMany = db.transaction((cats) => {
		  for (const cat of cats) insert.run(cat);
		});

		insertMany([
		  { name: 'cat1', age: 2 },
		  { name: 'cat2', age: 5 },
		  { name: 'cat3', age: 9 },
		  { name: 'cat4', age: 21 }
		]);
	} catch (err) {
		console.log(err);
		console.error("ERROR with INSERT (multiple cats). Probably a dupe. continuing.");
	}
}

function deleteCatByName (catName) {
	try {
		const deleteIt = db.prepare(`DELETE from cats where name = '${catName}'`);
		deleteIt.run();
	} catch (err) {
		console.log(err);
		console.error("ERROR with DELETE. Continuing.");
	}
}

// let's get to work!
createNewDatabase();		// .. if not created already
createTheTable();		// .. if not created already

//insertManyCats();		// bulkload of cats, if one is a dupe they all fail.
insertOneCat("cat1", 12);
insertOneCat("cat2", 8);
insertOneCat("cat3", 6);
insertOneCat("cat4", 9);

console.log(selectAllCats());	// display all the cats

deleteCatByName("cat1");	// delete cat1
deleteCatByName("cat2");	// delete cat2
deleteCatByName("cat100");	// delete cat that does not exist

console.log(selectAllCats());	// display all the cats that are left


deleteCatByName("cat3");	// delete cat3
console.log(selectOneCat("cat3"));
console.log(selectOneCat("cat4"));
