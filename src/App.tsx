import "./App.css";
import { MessageList } from "./MessageList";
import { useSnapshot } from "valtio";
import styles from "./App.module.css";
import { store, creatorType, creatorTypes } from "./store";
import { MessageCell } from "./MessageCell";

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
        <button onClick={store.addToTop.bind(store, 1)}>Add to top</button>
        <button onClick={store.addToBottom.bind(store, 1)}>
          Add to bottom
        </button>
        <button onClick={store.addToTop.bind(store, 3)}>Add 3 to top</button>
        <button onClick={store.addToBottom.bind(store, 3)}>
          Add 3 to bottom
        </button>

        <code>
          <pre>{JSON.stringify(snap.debug, null, 2)}</pre>
        </code>
      </div>
      <MessageList
        header={<h1>This is the top of the thing, yada yada yada </h1>}
      >
        {snap.messages.map((m) => (
          <MessageCell message={m} key={m.id} />
        ))}
      </MessageList>
    </div>
  );
}

export default App;
