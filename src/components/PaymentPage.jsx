import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Alert, ProgressBar } from 'react-bootstrap';

const PaymentPage = () => {
  const { season, episode } = useParams();
  const navigate = useNavigate();
  const totalTime = 240; // 4 minutos en segundos
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [message, setMessage] = useState('');

  // Temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          // Cambiar el estado a Disponible antes de redirigir
          cancelReservation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Función para cancelar la reserva (cambiar estado a Disponible)
  const cancelReservation = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/disponible/', {
        temporada: season,
        episodio: episode,
      });
      // Redirigir al index con mensaje de éxito
      navigate('/', { state: { message: 'El tiempo para pagar ha expirado. El capítulo está disponible nuevamente.' } });
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      // Redirigir al index incluso si hay un error, pero con un mensaje diferente
      navigate('/', { state: { message: 'El tiempo para pagar ha expirado, pero hubo un error al cambiar el estado del capítulo.' } });
    }
  };

  // Función para confirmar el pago
  const handlePayment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/pagar/', {
        temporada: season,
        episodio: episode,
      });
      navigate('/', { state: { message: 'Pago confirmado. El capítulo ahora está Alquilado.' } });
    } catch (error) {
      console.error('Error al confirmar el pago:', error);
      setMessage('Error al confirmar el pago. Intenta de nuevo.');
    }
  };

  // Calcular el porcentaje del tiempo restante
  const progress = (timeLeft / totalTime) * 100;

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Confirmar Pago</h1>
      {message && <Alert variant="danger">{message}</Alert>}
      <div className="text-center">
        <p>Tiempo restante para confirmar el pago: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />
        <Button variant="success" onClick={handlePayment} disabled={timeLeft <= 0}>
          Confirmar Pago
        </Button>
      </div>
    </Container>
  );
};

export default PaymentPage;