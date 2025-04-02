import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const ChapterList = () => {
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || '');

  // Función para obtener los capítulos desde la API
  const fetchChapters = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/capitulos/');
      setChapters(response.data);
    } catch (error) {
      console.error('Error al obtener los capítulos:', error);
    }
  };

  // Carga los capítulos al montar el componente y actualiza cada 10 segundos
  useEffect(() => {
    fetchChapters();
    const interval = setInterval(fetchChapters, 10000);
    return () => clearInterval(interval);
  }, []);

  // Función para manejar la acción de alquilar
  const handleRent = async (chapter) => {
    try {
      // Enviar solicitud para reservar el capítulo con temporada y episodio
      await axios.post('http://127.0.0.1:8000/alquilar/', {
        temporada: chapter.temporada,
        episodio: chapter.episodio,
      });

      // Redirigir a la página de pago con temporada y episodio
      navigate(`/pagar/${chapter.temporada}/${chapter.episodio}`);
    } catch (error) {
      console.error('Error al reservar el capítulo:', error);
      setMessage('No se pudo reservar el capítulo. Intenta de nuevo.');
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Lista de Capítulos</h1>
      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} onClose={() => setMessage('')} dismissible>
          {message}
        </Alert>
      )}
      <Row>
        {chapters.map((chapter, index) => (
          <Col md={4} key={`${chapter.temporada}-${chapter.episodio}-${index}`} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{chapter.titulo}</Card.Title>
                <Card.Text>
                  Temporada: {chapter.temporada}, Episodio: {chapter.episodio}
                  <br />
                  Estado:{' '}
                  <span
                    style={{
                      color: chapter.estado === 'Disponible' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {chapter.estado}
                  </span>
                </Card.Text>
                <Button
                  variant={chapter.estado === 'Disponible' ? 'primary' : 'secondary'}
                  disabled={chapter.estado !== 'Disponible'}
                  onClick={() => handleRent(chapter)}
                  className="w-100"
                >
                  {chapter.estado === 'Disponible' ? 'Alquilar' : 'No disponible'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ChapterList;