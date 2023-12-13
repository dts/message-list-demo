import { Message } from './Message';
import styles from './MessageItem.module.css';

export function MessageCell({ message }: { message: Message }) {
  return (
    <li key={message.id} className={styles.messageItem}>
      {message.avatar && (
        <div className={styles.avatar}>
          <img src={message.avatar} alt={`${message.senderName}'s avatar`} />
        </div>
      )}
      <div className={styles.messageContent}>
        <div className={styles.senderName}>{message.senderName}</div>
        <div className={styles.body}>{message.body}</div>
        {message.attachmentImage && (
          <img
            src={message.attachmentImage}
            alt="attachment"
            className={styles.attachmentImage}
          />
        )}
      </div>
    </li>
  );
}
