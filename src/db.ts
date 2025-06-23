import { openDB } from 'idb';

const DB_NAME = 'name-storage';
const STORE_NAME = 'names';

type Person = {
  id?: number;
  name: string;
  phone: string;
  description: string;
  price: string;
  date?: string;
  done?: boolean;
};

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addPerson(person: { name: string; phone: string; description: string;done?: boolean;price: string ;date: string }) {
  const db = await getDB();
  await db.add(STORE_NAME, person);
}

export async function getAllPeople(): Promise<Person[]> {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function deletePerson(id: number) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function editPerson(id: number, name: string, phone: string, description: string ,price:string ,date: string,done: boolean ) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const person = await store.get(id);
  
  if (person) {
    person.name = name;
    person.phone = phone;
    person.description = description;
    person.price = price;
    person.date = date;
    person.done = done;
    await store.put(person);
  }
  
  await tx.done;
}