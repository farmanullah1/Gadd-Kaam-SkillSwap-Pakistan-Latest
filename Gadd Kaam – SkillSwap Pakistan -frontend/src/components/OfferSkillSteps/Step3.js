// src/components/OfferSkillSteps/Step3.js
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { VscClose } from 'react-icons/vsc';
import axios from 'axios';

const Step3 = ({ onNext, onBack, data }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSkillsToSwap, setSelectedSkillsToSwap] = useState(data.skillsToSwap || []);

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

  const handleSelectSkillToSwap = (skillName) => {
    if (selectedSkillsToSwap.length >= 3) {
      setError('You can select up to 3 skills to swap.');
      return;
    }
    const skillExists = selectedSkillsToSwap.some(s => s.toLowerCase() === skillName.toLowerCase());
    if (!skillExists) {
        setSelectedSkillsToSwap([...selectedSkillsToSwap, skillName]);
        setSearchTerm('');
        setShowSuggestions(false);
        setError(null);
    }
  };

  const handleRemoveSkillToSwap = (skillToRemove) => {
    setSelectedSkillsToSwap(selectedSkillsToSwap.filter(s => s !== skillToRemove));
    setError(null);
  };
  
  const handleNextClick = () => {
    onNext({ skillsToSwap: selectedSkillsToSwap });
  };


  return (
    <div>
      <h2 className="step-content-heading">{t('step3_offer_skill')}</h2>
      <p className="step-content-subheading">{t('step3_offer_skill_desc')}</p>
      <div className="form-group form-group-skills-select">
        <label htmlFor="skillsToSwap">{t('step3_offer_skill_label')}</label>
        
        <div className="skills-input-container">
          <input
            type="text"
            id="skillsToSwap"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={t('step3_offer_skill_placeholder')}
            className="form-input"
            autoComplete="off"
          />
        </div>
        {error && <p className="error-message">{error}</p>}

        <div className="selected-skills-container">
            {selectedSkillsToSwap.map((skill, index) => (
                <span key={index} className="selected-skill-tag">
                    {skill} <button type="button" onClick={() => handleRemoveSkillToSwap(skill)}><VscClose /></button>
                </span>
            ))}
        </div>

        {showSuggestions && (
          <ul className="skill-suggestions-dropdown">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((s, index) => (
                <li key={index} onMouseDown={() => handleSelectSkillToSwap(s.skillName)}>{s.skillName}</li>
              ))
            ) : (
              <li className="no-suggestions-item">No suggestions found.</li>
            )}
          </ul>
        )}
      </div>
      <div className="offer-skill-actions">
        <button type="button" className="btn-secondary-outline" onClick={onBack}>
          <FaChevronLeft style={{ marginRight: '8px' }} /> {t('go_back_btn')}
        </button>
        <button type="button" className="btn-primary-orange" onClick={handleNextClick}>
          Next <FaChevronRight style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
};

export default Step3;