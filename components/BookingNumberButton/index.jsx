/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import firebase from '../../firebase/clientApp';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

import useSound from 'use-sound';

export default function BookingNumberButton({
  bookingNumber,
  setBookingNumber,
}) {
  const db = getFirestore(firebase);

  const [play] = useSound('/audios/clareou.mp3');

  const unsub = onSnapshot(collection(db, 'salgados'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const data = change.doc.data();
        if (data.booking) {
          setBookingNumber(data.booking.length);
          if (data.booking.length > 0 && data.lastUpdated === 'number') play();
        }
      }
    });
  });

  return (
    <Button onClick={play} style={{ height: '48px' }}>
      {bookingNumber} reservas
    </Button>
  );
}
