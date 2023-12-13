import './App.css';
import { MessageList } from './MessageList';
import { useSnapshot } from 'valtio';
import styles from './App.module.css';
import { store, creatorType, creatorTypes } from './store';

function App() {
  const snap = useSnapshot(store);

  return (
    <div className={styles.appLayout}>
      <div className="actions">
        <select
          onChange={(e) => store.setType(creatorType(e.target?.value))}
          value={snap.typeToCreate}
        >
          {creatorTypes.map((type) => (
            <option value={type}>{type}</option>
          ))}
        </select>
        <button onClick={store.addToTop.bind(store)}>Add to top</button>
        <button onClick={store.addToBottom.bind(store)}>Add to bottom</button>
        <code>
          <pre>{JSON.stringify(snap.debug, null, 2)}</pre>
        </code>
      </div>
      <MessageList messages={snap.messages} />
    </div>
  );
}

export default App;
