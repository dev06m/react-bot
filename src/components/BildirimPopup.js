import React, { useState, useEffect } from 'react';

function BildirimPopup() {
  const [popupAcik, setPopupAcik] = useState(true);

  const kapatPopup = () => {
    setPopupAcik(false);
  };

  useEffect(() => {
    const otomatikKapatmaZamani = 1000; // 1 saniye (1000 milisaniye)

    const kapatmaZamani = setTimeout(() => {
      if (popupAcik) {
        setPopupAcik(false);
      }
    }, otomatikKapatmaZamani);

    return () => clearTimeout(kapatmaZamani);
  }, [popupAcik]);

  return (
    <div>
      {popupAcik && (
        <div className="popup">
          <span className="kapat" onClick={kapatPopup}>
            &times;
          </span>
          <p>Merhaba! Bu bir bildirim popup.Merhaba! Bu bir bildirim popupMerhaba! Bu bir bildirim popupMerhaba! Bu bir bildirim popupMerhaba! Bu bir bildirim popup</p>
        </div>
      )}
    </div>
  );
}

export default BildirimPopup;






