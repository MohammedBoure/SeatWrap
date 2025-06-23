import { useState, useEffect } from 'react';
import { addPerson, getAllPeople, deletePerson, editPerson ,getDB} from './db';
import DatePicker from 'react-datepicker';
import { FaBars, FaTimes , FaArrowUp } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

type Person = {
  id?: number;
  name: string;
  phone: string;
  description: string;
  price: string;
  date?: string;
  done?: boolean;
};

function PhoneBook() {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('Free');
  const [done, setDone] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());

  const [showDone, setShowDone] = useState(false); // Checkbox for done === true
  const [showNotDone, setShowNotDone] = useState(false); // Checkbox for done === false
  const [showDate, setShowDate] = useState<Date | null>(null); // Checkbox for date filter

  const [people, setPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [visibleCount, setVisibleCount] = useState(2); // Show 2 at a time
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  });



  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const loadPeople = async () => {
      const result = await getAllPeople();
      setPeople(result);
    };
    loadPeople();
  }, []);

  const handleDelete = async (id?: number) => {
    if (id !== undefined) {
      await deletePerson(id);
      const updated = await getAllPeople();
      setPeople(updated);
    }
  };



  const handleAdd = async () => {
    if (name.trim() && phone.trim() && description.trim()) {
      await addPerson({
        name: name.trim(),
        phone: phone.trim(),
        description: description.trim(),
        price: price.trim(),
        done: done,
        date: date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'numeric', year: 'numeric' }) : '',
      });
      const updated = await getAllPeople();
      setPeople(updated);
      setName('');
      setPhone('');
      setDescription('');
      setPrice('Free');
      setDate(new Date()); // Reset date to today
      setDone(false);
    }
  };

  const showDiv = (person: Person) => {
  const div = document.querySelector('.edit-div') as HTMLElement | null;
  const container = document.querySelector('.container') as HTMLElement | null;

  if (div && container) {
    try {
      div.style.display = 'flex';
      container.style.filter = 'blur(2px)';
      setEditingPerson(person);
      setName(person.name || '');
      setPhone(person.phone || '');
      setDescription(person.description || '');
      setPrice(person.price || 'Free');
      // Parse date safely
      setDate(person.date ? new Date(person.date.split('/').reverse().join('-')) : null);
      setDone(person.done || false);
    } catch (error) {
      console.error('Error in showDiv:', error);
    }
  } else {
    console.error('Could not find .edit-div or .container elements');
  }
};

  const closeEditDiv = () => {
    const div = document.querySelector('.edit-div') as HTMLElement;
    const container = document.querySelector('.container') as HTMLElement;
    if (div && container) {
      div.style.display = 'none';
      container.style.filter = 'blur(0px)';
      setEditingPerson(null);
      setName('');
      setPhone('');
      setDescription('');
      setPrice('free');
      setDate(new Date());
      setDone(false);
    }
  };

  const handleSave = async () => {
    if (editingPerson?.id && name.trim() && phone.trim() && description.trim()) {
      await editPerson(
        editingPerson.id,
        name.trim(),
        phone.trim(),
        description.trim(),
        price.trim(),
        date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'numeric', year: 'numeric' }) : '',
        done
      );
      const updated = await getAllPeople();
      setPeople(updated);
      closeEditDiv();
    }
  };

  const handleDeleteInEdit = async () => {
    if (editingPerson?.id) {
      await deletePerson(editingPerson.id);
      const updated = await getAllPeople();
      setPeople(updated);
      closeEditDiv();
    }
  };

  // Handle "Show only done" checkbox
  const handleShowDoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDone(e.target.checked);
    if (e.target.checked) setShowNotDone(false); // Uncheck "not done"
  };

  // Handle "Show only not done" checkbox
  const handleNotDoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowNotDone(e.target.checked);
    if (e.target.checked) setShowDone(false); // Uncheck "done"
  };


  const filteredPeople = people.filter(
  (p) =>
    // Checkbox filters: apply done === true if showDone is true, done === false if showNotDone is true
    (!showDone || p.done === true) &&
    (!showNotDone || p.done === false) &&
    // Date filter: match date if showDate is set, otherwise ignore
    (!showDate ||
      (p.date &&
        // Convert p.date (DD/MM/YYYY) to Date and compare
        new Date(p.date.split('/').reverse().join('-')).toLocaleDateString('en-GB') ===
          showDate.toLocaleDateString('en-GB'))) &&
    // Search filter: match searchTerm across fields
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.price && p.price.toString().includes(searchTerm)) ||
      (p.done !== undefined && p.done.toString().toLowerCase().includes(searchTerm.toLowerCase())))
);

useEffect(() => {
  getAllPeople().then(setPeople);
}, []);

// Export data as JSON
const exportData = async () => {
  try {
    const data = await getAllPeople();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `names_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

// Import data from JSON file
const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data: Person[] = JSON.parse(text);

    // Validate data
    if (!Array.isArray(data)) throw new Error('Invalid JSON: Expected an array');

    const db = await getDB();
    const tx = db.transaction('names', 'readwrite');
    const store = tx.objectStore('names');

    for (const person of data) {
      if (
        typeof person.name === 'string' &&
        typeof person.phone === 'string' &&
        typeof person.description === 'string' &&
        typeof person.price === 'string' &&
        (person.date === undefined || typeof person.date === 'string') &&
        (person.done === undefined || typeof person.done === 'boolean')
      ) {
        await store.put(person); // Use put to add or update
      } else {
        console.warn('Invalid person data skipped:', person);
      }
    }

    await tx.done;
    const updated = await getAllPeople();
    setPeople(updated);
    event.target.value = ''; // Reset file input
  } catch (error) {
    console.error('Error importing data:', error);
  }
};


useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.scrollHeight;

    const scrollPercent = (scrollTop + windowHeight) / fullHeight;

    if (scrollPercent > 0.8 && visibleCount < filteredPeople.length) {
      setVisibleCount((prev) => Math.min(prev + 2, filteredPeople.length));
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [visibleCount, filteredPeople.length]);

const scrollToTop = () => {
  const duration = 500;
  const start = window.scrollY;
  const startTime = performance.now();

  const animateScroll = (time: number) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start * (1 - progress));
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};


const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className='sidebarbtn'>
        {isOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
      </button>
      {
      isOpen &&
      <div className='theme-div'> 
        <button onClick={exportData}>Export Data</button>
        <label htmlFor="file-upload" className="uploadbtn">Upload Data</label>
        <input id="file-upload" type="file" accept=".json" onChange={importData} className='import-input'/>
        <button onClick={toggleTheme} className='theme-button'>theme is:{theme}</button>
      </div>
      }
      <button className='scrolltotop' onClick={scrollToTop}><FaArrowUp /></button>
      <div className='edit-div'>
        <p className='theme-p'>you can change every thing :) </p>
          <br></br>
            <div className='close-div'>
              <button className='close-button' onClick={closeEditDiv}>X</button>
            </div>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          className='description'
          rows={3}
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
        placeholder="i know you are rich ;)"
        type='number'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />
        <div className='date-div'>
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="date-input"
          />
        </div>
          <div className='done-div'>
            <p className='done'>Done:</p>
            <input
              type="checkbox"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
              className='checkbox'
            />
          </div>
        <button className='theme-button' onClick={handleSave}>Save</button>
        <button className='delete-button' onClick={handleDeleteInEdit}>Delete</button>
      </div>
      <div className="container">
        <h2>Add Contact</h2>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          className='description'
          rows={3}
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
        placeholder="i know you are rich ;)"
        type='number'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />
        <div className='done-div'>
          <p className='done'>Done?,let me know :) →</p>
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
            className='checkbox'
          />
        </div>
        <DatePicker
          selected={date}
          onChange={(date: Date | null) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/YYYY"
          className="date-input"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <div className='container'>
        <h2>Search</h2>
        <div className='search-div'>
          <input
            type="text"
            placeholder="Search name, phone, description or price ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DatePicker
            selected={showDate}
            onChange={(date: Date | null) => setShowDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="date-input"
          />
          <div className='sort-div'>
            <p>work done</p>
            <input
              className='sort-checkboxD'
              type="checkbox"
              checked={showDone}
              onChange={handleShowDoneChange}
            />
          </div>
          <div className='sort-div'>
            <p>work not done</p>
            <input
              className='sort-checkboxND'
              type="checkbox"
              checked={showNotDone}
              onChange={handleNotDoneChange}
            />
          </div>
        </div>
        <h3>People</h3>
        <ul>
        {filteredPeople.slice(0, visibleCount).map((person) => (
            <li key={person.id}>
              <div className='output-div'>
                <p className='info'>Name:</p>                <p className='data'>{person.name}</p>
              </div>
              <div className='output-div'>
                <p className='info'>Phone:</p>               <p className='data'>{person.phone}</p>
              </div>
              <div className='output-div'>
                <p className='info'>Description:</p>         <p className='data'>{person.description}</p>
              </div>
              <div className='output-div'>
                <p className='info'>Done?:</p>               <p className='data'>{person.done ? 'Yes' : 'No'}</p> 
              </div>
              <div className='output-div'>
                <p className='info'>Price:</p>               <p className='data'>{person.price}</p>
              </div>
              <div className='output-div'>
                <p className='info'>date:</p>                 <p className='data-date'>{person.date}</p>
              </div>
              <button onClick={() => handleDelete(person.id)} className='delete-button'>Delete</button>
              <button onClick={() => showDiv(person)} className='edit-button'>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default PhoneBook;