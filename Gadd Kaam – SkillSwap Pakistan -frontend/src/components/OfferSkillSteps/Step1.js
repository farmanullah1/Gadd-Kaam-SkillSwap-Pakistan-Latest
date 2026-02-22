// src/components/OfferSkillSteps/Step1.js

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import { VscClose } from 'react-icons/vsc';

const Step1 = ({ onNext, data }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState(data.skills || []);

  const initialSuggestions = [
    { skillName: 'Tractor Repair' },
    { skillName: 'Water Pump Maintenance' },
    { skillName: 'Basic Welding' },
    { skillName: 'English Speaking' },
    { skillName: 'Smartphone Usage' },
    { skillName: 'Public Speaking' },
    { skillName: 'Cooking' },
    { skillName: 'Writing' },
    { skillName: 'Embroidery' },
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-suggestions`);
        const allSuggestionsMap = new Map();
        initialSuggestions.forEach(s => allSuggestionsMap.set(s.skillName.toLowerCase(), s));
        res.data.forEach(s => allSuggestionsMap.set(s.skillName.toLowerCase(), s));
        const uniqueSuggestions = Array.from(allSuggestionsMap.values());
        
        setSuggestions(uniqueSuggestions);
      } catch (err) {
        console.error('Failed to fetch skill suggestions:', err);
        setSuggestions(initialSuggestions);
      }
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    setFilteredSuggestions(
      suggestions.filter(s => s.skillName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, suggestions]);

  const handleSelectSkill = (skillName) => {
    if (selectedSkills.length >= 3) {
      setError('You can select up to 3 skills.');
      return;
    }
    const skillExists = selectedSkills.some(s => s.toLowerCase() === skillName.toLowerCase());
    if (!skillExists) {
      setSelectedSkills([...selectedSkills, skillName]);
      setSearchTerm('');
      setShowSuggestions(false);
      setError(null);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
    setError(null);
  };

  const handleAddCustomSkill = async () => {
    const newSkill = searchTerm.trim();
    if (!newSkill) return;

    const skillExists = selectedSkills.some(s => s.toLowerCase() === newSkill.toLowerCase());
    if (skillExists) {
      setError('This skill is already selected.');
      return;
    }
    
    if (selectedSkills.length >= 3) {
        setError('You can select up to 3 skills.');
        return;
    }

    try {
      const token = localStorage.getItem('token');
      const suggestionExists = suggestions.some(s => s.skillName.toLowerCase() === newSkill.toLowerCase());

      if (!suggestionExists) {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/skill-suggestions`, { skillName: newSkill }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`New skill '${newSkill}' added to suggestions.`);
      }
      handleSelectSkill(newSkill);
    } catch (err) {
      console.error('Failed to add new skill or publish:', err);
      setError('Could not save new skill suggestion, but proceeding. Please try again later.');
      handleSelectSkill(newSkill);
    }
  };

  const handleNextClick = () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill to offer.');
    } else {
      onNext({ skills: selectedSkills });
    }
  };

  return (
    <div>
      <h2 className="step-content-heading">{t('step1_offer_skill')}</h2>
      <p className="step-content-subheading">{t('step1_offer_skill_desc')}</p>
      
      <div className="form-group form-group-skills-select">
        <label htmlFor="skills">{t('step1_offer_skill_label')}</label>
        
        <div className="skills-input-container">
          <input
            type="text"
            id="skills"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={t('step1_offer_skill_placeholder')}
            className="form-input"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              className="add-skill-btn"
              onClick={handleAddCustomSkill}
              disabled={selectedSkills.length >= 3}
            >
              Add
            </button>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
        
        <div className="selected-skills-container">
            {selectedSkills.map((skill, index) => (
                <span key={index} className="selected-skill-tag">
                    {skill} <button type="button" onClick={() => handleRemoveSkill(skill)}><VscClose /></button>
                </span>
            ))}
        </div>

        {showSuggestions && (
          <ul className="skill-suggestions-dropdown">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((s, index) => (
                <li key={index} onMouseDown={() => handleSelectSkill(s.skillName)}>{s.skillName}</li>
              ))
            ) : (
              <li className="no-suggestions-item">No suggestions found.</li>
            )}
          </ul>
        )}
      </div>

      <div className="offer-skill-actions">
        <button
          type="button"
          className="btn-primary-orange"
          onClick={handleNextClick}
          disabled={selectedSkills.length === 0}
        >
          Next <FaChevronRight style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
};

export default Step1;