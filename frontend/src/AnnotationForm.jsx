import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AnnotationForm = ({ time, onSave }) => {
  const [annotation, setAnnotation] = useState('');
  const [createdBy, setCreatedBy] = useState(''); // Later, this can be prepopulated via authentication

  const handleSave = () => {
    if (annotation.trim() && createdBy.trim()) {
      onSave({ time, annotation, createdBy });
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    <FormWrap>
      <h3>Create Annotation</h3>
      <label>
        Time: <strong>{time}s</strong>
      </label>
      <label>
        User Name:
        <input
          type="text"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
        />
      </label>
      <label>
        Annotation:
        <textarea
          value={annotation}
          onChange={(e) => setAnnotation(e.target.value)}
          rows="4"
        />
      </label>
      <button onClick={handleSave}>Save Annotation</button>
    </FormWrap>
  );
};

AnnotationForm.propTypes = {
  time: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

const FormWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 1000;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  h3 {
    margin-top: 0;
  }

  label {
    display: block;
    margin-bottom: 10px;
  }

  textarea,
  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 15px;
    box-sizing: border-box;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export default AnnotationForm;
