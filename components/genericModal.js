import styles from "../styles/genericModal.module.css";

export default function GenericModal({ isOpen, onClose, children }) {
  function handleOnClose() {
    onClose();
  }

  function onMainClick(event) {
    event.stopPropagation();
  }
  return (
    <div
      className={`${styles.modal} ${
        isOpen ? styles.modalOpen : styles.modalClosed
      }`}
      onClick={handleOnClose}
    >
      <div className={styles.main} onClick={onMainClick}>
        <h1>TEST TITLE</h1>
        <p>test paragraph</p>
        {children}
      </div>
    </div>
  );
}
