// src/components/OfferSkillPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import SuccessMessageModal from '../components/SuccessMessageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { 
  Upload, MapPin, Globe, EyeOff, Shield, Type, FileText, Tag, Send, X, Image as ImageIcon, Star, User
} from 'lucide-react';

const PAKISTAN_GEOGRAPHY = {
  "Punjab": {
    "Lahore": ["Gulberg", "Model Town", "DHA", "Johar Town", "Samanabad", "Iqbal Town", "Bahria Town", "Cantt", "Walled City"],
    "Rawalpindi": ["Saddar", "Satellite Town", "Bahria Town", "Cantt", "Adyala Road", "Westridge", "Chaklala", "Commercial Market"],
    "Multan": ["Bosan Road", "Gulgasht Colony", "Cantt", "Shah Rukn-e-Alam", "Mumtazabad"],
    "Faisalabad": ["D-Ground", "Peoples Colony", "Civil Lines", "Samanabad", "Madina Town"],
    "Sialkot": ["Cantt", "Paris Road", "Shahabpura", "Sialkot Fort", "Model Town"],
    "Gujranwala": ["Satellite Town", "Model Town", "Peoples Colony", "Cantt"],
    "Sargodha": ["Satellite Town", "University Road", "New Town"],
    "Bahawalpur": ["Model Town", "Dubai Mahal Road", "Cantt"],
    "Sheikhupura": ["Housing Colony", "Civil Lines", "Sargodha Road"]
  },
  "Sindh": {
    "Karachi": ["Clifton", "DHA", "Gulshan-e-Iqbal", "North Nazimabad", "Saddar", "Malir", "Korangi", "Federal B Area", "PECHS", "Nazimabad"],
    "Hyderabad": ["Latifabad", "Qasimabad", "Saddar", "Autobahn", "Hirabad"],
    "Jamshoro": ["SU Society", "Kotri", "Jamshoro Colony"],
    "Sukkur": ["Barrage Road", "Military Road", "Shalimar"],
    "Larkana": ["Civil Lines", "Lahori Mohalla", "Sachai Colony"],
    "Mirpurkhas": ["Satellite Town", "Ring Road", "Hirabad"]
  },
  "Khyber Pakhtunkhwa (KPK)": {
    "Peshawar": ["Hayatabad", "Peshawar Cantt", "University Town", "Ring Road", "Board Bazar", "Warsak Road"],
    "Abbottabad": ["Jinnahabad", "Mandian", "Shimla Hill", "Cantt", "Supply"],
    "Mardan": ["Sheikh Maltoon", "Cantt", "Hoti"],
    "Swat": ["Mingora", "Saidu Sharif", "Kalam Road"],
    "Kohat": ["KDA", "Cantt", "Togh Bala"]
  },
  "Balochistan": {
    "Quetta": ["Jinnah Road", "Cantt", "Satellite Town", "Double Road", "Samungli Road"],
    "Gwadar": ["New Town", "Port Road", "Marine Drive"],
    "Khuzdar": ["Satellite Town", "Jinnah Road"],
    "Turbat": ["Main Bazaar", "Apsar"]
  },
  "Gilgit-Baltistan": {
    "Gilgit": ["Jutial", "Danyore", "Chinar Bagh"],
    "Skardu": ["Main Bazaar", "Satpara Road"],
    "Hunza": ["Karimabad", "Aliabad"]
  },
  "Azad Jammu & Kashmir (AJK)": {
    "Muzaffarabad": ["Goira", "Plate", "Chattar"],
    "Mirpur": ["Sector F/1", "Sector C/3", "Sector D/4"],
    "Rawalakot": ["Main Bazaar", "Singola"]
  },
  "Islamabad Capital Territory": {
    "Islamabad": ["F-6", "F-7", "F-8", "F-10", "G-9", "G-11", "I-8", "E-7", "DHA", "Bahria Town", "Blue Area"]
  }
};

function OfferSkillPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [skillsToSwap, setSkillsToSwap] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isWomenZone, setIsWomenZone] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Locations Select States
  const [geoData, setGeoData] = useState(PAKISTAN_GEOGRAPHY);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customSubdistrict, setCustomSubdistrict] = useState('');

  // Modals
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  // Constants
  const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB in bytes

  useEffect(() => {
    const fetchLocationsAndUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Parse user default location dynamically
        const defaultLoc = parsedUser.location || '';
        if (defaultLoc) {
          const parts = defaultLoc.split(',').map(p => p.trim());
          if (parts.length === 3) {
            const [prov, city, sub] = parts;
            if (PAKISTAN_GEOGRAPHY[prov]) {
              setSelectedProvince(prov);
              if (PAKISTAN_GEOGRAPHY[prov][city]) {
                setSelectedCity(city);
                if (PAKISTAN_GEOGRAPHY[prov][city].includes(sub)) {
                  setSelectedSubdistrict(sub);
                }
              }
            }
          } else if (parts.length === 2) {
            const [city, sub] = parts;
            for (const [prov, cities] of Object.entries(PAKISTAN_GEOGRAPHY)) {
              if (cities[city]) {
                setSelectedProvince(prov);
                setSelectedCity(city);
                if (cities[city].includes(sub)) {
                  setSelectedSubdistrict(sub);
                }
                break;
              }
            }
          }
        }
      } else {
        navigate('/login');
      }
    };
    
    fetchLocationsAndUser();
  }, [navigate]);

  // Synchronize dropdown selections to locationValue string
  useEffect(() => {
    if (selectedProvince) {
      let val = selectedProvince;
      let finalCity = selectedCity;
      if (selectedCity === 'Other') {
        finalCity = customCity;
      }
      
      if (finalCity) {
        val += `, ${finalCity}`;
        let finalSub = selectedSubdistrict;
        if (selectedSubdistrict === 'Other') {
          finalSub = customSubdistrict;
        }
        
        if (finalSub) {
          val += `, ${finalSub}`;
        }
      }
      setLocationValue(val);
    } else {
      setLocationValue('');
    }
  }, [selectedProvince, selectedCity, selectedSubdistrict, customCity, customSubdistrict]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // 1. Validate File Size (6 MB Limit)
      if (file.size > MAX_FILE_SIZE) {
        setError(t('error_file_too_large') || 'File size exceeds 6 MB. Please upload a smaller image.');
        return;
      }

      // 2. Validate File Type (PNG, JPEG, JPG)
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError(t('error_invalid_file_type') || 'Invalid file type. Please upload a PNG, JPEG, or JPG image.');
        return;
      }

      // If valid
      setError('');
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreviewUrl(null);
    setError('');
  };

  const handleCustomCityBlur = () => {
    if (customCity.trim() && selectedProvince) {
      const trimmed = customCity.trim();
      setGeoData(prev => {
        const provinceData = { ...prev[selectedProvince] };
        if (!provinceData[trimmed]) {
          provinceData[trimmed] = ["Other"];
          return {
            ...prev,
            [selectedProvince]: provinceData
          };
        }
        return prev;
      });
      setSelectedCity(trimmed);
      setCustomCity('');
    }
  };

  const handleCustomSubdistrictBlur = () => {
    if (customSubdistrict.trim() && selectedProvince && selectedCity) {
      const trimmed = customSubdistrict.trim();
      setGeoData(prev => {
        const provinceData = { ...prev[selectedProvince] };
        const cityData = [...(provinceData[selectedCity] || [])];
        if (!cityData.includes(trimmed)) {
          cityData.unshift(trimmed);
          provinceData[selectedCity] = cityData;
          return {
            ...prev,
            [selectedProvince]: provinceData
          };
        }
        return prev;
      });
      setSelectedSubdistrict(trimmed);
      setCustomSubdistrict('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title.trim() || !description.trim() || (!isRemote && !locationValue.trim())) {
        setError(t('fill_all_required_fields'));
        setLoading(false);
        return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Convert comma-separated string to JSON array string
      const skillsArray = title.split(',').map(s => s.trim()).filter(s => s !== '');
      const swapArray = skillsToSwap.split(',').map(s => s.trim()).filter(s => s !== '');

      formData.append('skills', JSON.stringify(skillsArray));
      formData.append('description', description);
      formData.append('location', locationValue);
      formData.append('remotely', isRemote);
      formData.append('anonymous', isAnonymous);
      formData.append('shareWithWomenZone', isWomenZone);
      formData.append('skillsToSwap', JSON.stringify(swapArray));
      
      if (photo) {
        formData.append('photo', photo);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/skill-offers`, formData, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });

      setShowSuccessModal(true);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || t('offer_publish_error_message'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/marketplace');
  };

  const getPreviewImage = () => previewUrl || "https://placehold.co/400x250/e0e0e0/666666?text=No+Image";

  if (!user) return null;

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={() => { localStorage.clear(); navigate('/login'); }} user={user} />

      <main className="max-w-[1300px] w-full mx-auto px-4 md:px-6 py-12 min-h-[85vh] animate-[alertPop_0.5s_ease-out]">
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 bg-gradient-to-r from-slate-900 via-slate-750 to-primary-orange dark:from-white dark:via-slate-200 dark:to-orange-400 bg-clip-text text-transparent">{t('offer_a_skill_title')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[600px] mx-auto">{t('offer_a_skill_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
            
            {/* LEFT: FORM */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-slate-950/20">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {error && (
                      <div className="flex items-center justify-center p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 rounded-2xl text-xs font-bold text-red-600 dark:text-red-400 text-center animate-alert-pop">
                        {error}
                      </div>
                    )}

                    {/* Photo Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-primary-orange dark:text-orange-400" /> 
                          {t('cover_photo_label')}
                        </label>
                        <div className={`w-full h-60 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-orange dark:hover:border-orange-500 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden relative cursor-pointer group ${previewUrl ? 'border-solid border-slate-200 dark:border-slate-800 p-0' : ''}`}>
                            {previewUrl ? (
                                <div className="w-full h-full relative">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                      type="button" 
                                      className="absolute top-4 right-4 bg-slate-950/60 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-100 z-10 focus:outline-none" 
                                      onClick={removePhoto}
                                    >
                                      <X size={16}/>
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="skill-photo" className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500 w-full h-full justify-center cursor-pointer">
                                    <Upload size={32} className="text-primary-orange dark:text-orange-400 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-xs font-semibold">{t('click_to_upload')} (Max 6MB)</span>
                                    <input 
                                        id="skill-photo" 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg" 
                                        onChange={handlePhotoChange} 
                                        className="hidden" 
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="title">
                          <Type size={14} className="text-primary-orange dark:text-orange-400" /> 
                          {t('skill_title_label')}
                        </label>
                        <input 
                            type="text" 
                            id="title" 
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm" 
                            placeholder={t('skill_title_placeholder')} 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="desc">
                          <FileText size={14} className="text-primary-orange dark:text-orange-400" /> 
                          {t('description_label')}
                        </label>
                        <textarea 
                            id="desc" 
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm resize-y min-h-[120px]" 
                            rows="5" 
                            placeholder={t('description_placeholder')} 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="swap">
                          <Tag size={14} className="text-primary-orange dark:text-orange-400" /> 
                          {t('skills_wanted_label')}
                        </label>
                        <input 
                            type="text" 
                            id="swap" 
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm" 
                            placeholder={t('skills_wanted_placeholder')} 
                            value={skillsToSwap}
                            onChange={(e) => setSkillsToSwap(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                      
                      {/* Province Select */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="province-select">
                          <MapPin size={14} className="text-primary-orange dark:text-orange-400" /> 
                          {t('province_label')}
                        </label>
                        <select
                          id="province-select"
                          value={selectedProvince}
                          onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setSelectedCity('');
                            setSelectedSubdistrict('');
                          }}
                          disabled={isRemote}
                          required={!isRemote}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm disabled:opacity-50"
                        >
                          <option value="" className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">
                            {t('select_province')}
                          </option>
                          {Object.keys(geoData).map(prov => (
                            <option key={prov} value={prov} className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">{prov}</option>
                          ))}
                        </select>
                      </div>

                      {/* City Select & Custom Input */}
                      {selectedProvince && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="city-select">
                              <MapPin size={14} className="text-primary-orange dark:text-orange-400" /> 
                              {t('city_label')}
                            </label>
                            <select
                              id="city-select"
                              value={selectedCity}
                              onChange={(e) => {
                                setSelectedCity(e.target.value);
                                setSelectedSubdistrict(''); // reset subdistrict
                              }}
                              disabled={isRemote}
                              required={!isRemote}
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm disabled:opacity-50"
                            >
                              <option value="" className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">
                                {t('select_city')}
                              </option>
                              {Object.keys(geoData[selectedProvince] || {}).map(city => (
                                <option key={city} value={city} className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">{city}</option>
                              ))}
                              <option value="Other" className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">
                                {t('other_add_new_city')}
                              </option>
                            </select>
                          </div>

                          {selectedCity === 'Other' && (
                            <div className="flex flex-col gap-2 animate-alert-pop">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="custom-city-input">
                                <MapPin size={14} className="text-primary-orange dark:text-orange-400" /> 
                                {t('add_new_city_label')}
                              </label>
                              <input
                                type="text"
                                id="custom-city-input"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm"
                                placeholder={t('add_new_city_placeholder')}
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                                onBlur={handleCustomCityBlur}
                                required={selectedCity === 'Other'}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Area/Subdistrict Select & Custom Input */}
                      {selectedProvince && selectedCity && selectedCity !== 'Other' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="subdistrict-select">
                              <MapPin size={14} className="text-primary-orange dark:text-orange-400" /> 
                              {t('subdistrict_area_label')}
                            </label>
                            <select
                              id="subdistrict-select"
                              value={selectedSubdistrict}
                              onChange={(e) => setSelectedSubdistrict(e.target.value)}
                              disabled={isRemote}
                              required={!isRemote}
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm disabled:opacity-50"
                            >
                              <option value="" className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">
                                {t('select_area_subdistrict')}
                              </option>
                              {(geoData[selectedProvince][selectedCity] || []).map(sub => (
                                <option key={sub} value={sub} className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">{sub}</option>
                              ))}
                              <option value="Other" className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">
                                {t('other_add_new_area')}
                              </option>
                            </select>
                          </div>

                          {selectedSubdistrict === 'Other' && (
                            <div className="flex flex-col gap-2 animate-alert-pop">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="custom-subdistrict-input">
                                <MapPin size={14} className="text-primary-orange dark:text-orange-400" /> 
                                {t('add_new_area_label')}
                              </label>
                              <input
                                type="text"
                                id="custom-subdistrict-input"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm"
                                placeholder={t('add_new_area_placeholder')}
                                value={customSubdistrict}
                                onChange={(e) => setCustomSubdistrict(e.target.value)}
                                onBlur={handleCustomSubdistrictBlur}
                                required={selectedSubdistrict === 'Other'}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Toggles */}
                    <div className="bg-slate-50/60 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 mb-4 flex flex-col gap-4">
                        <label className="flex justify-between items-center cursor-pointer p-2.5 rounded-xl transition-colors hover:bg-white dark:hover:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-10 h-10 flex items-center justify-center flex-shrink-0 text-blue-500">
                                    <Globe size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{t('remote_work_label')}</span>
                                    <small className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('remote_work_desc')}</small>
                                </div>
                            </div>
                            <div className="relative">
                                <input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} className="sr-only peer" />
                                <div className="w-12 h-7 bg-slate-200 dark:bg-slate-800 rounded-full peer-checked:bg-emerald-500 transition-colors duration-300 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform duration-300 peer-checked:after:translate-x-5 shadow-sm"></div>
                            </div>
                        </label>

                        <label className="flex justify-between items-center cursor-pointer p-2.5 rounded-xl transition-colors hover:bg-white dark:hover:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-10 h-10 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400">
                                    <EyeOff size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{t('post_anonymously_label')}</span>
                                    <small className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('post_anonymously_desc')}</small>
                                </div>
                            </div>
                            <div className="relative">
                                <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="sr-only peer" />
                                <div className="w-12 h-7 bg-slate-200 dark:bg-slate-800 rounded-full peer-checked:bg-emerald-500 transition-colors duration-300 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform duration-300 peer-checked:after:translate-x-5 shadow-sm"></div>
                            </div>
                        </label>

                        {user.gender === 'Female' && (
                            <label className="flex justify-between items-center cursor-pointer p-2.5 rounded-xl transition-colors hover:bg-white dark:hover:bg-slate-900">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-10 h-10 flex items-center justify-center flex-shrink-0 text-pink-500">
                                        <Shield size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{t('women_only_zone_label')}</span>
                                        <small className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('women_only_zone_desc')}</small>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input type="checkbox" checked={isWomenZone} onChange={(e) => setIsWomenZone(e.target.checked)} className="sr-only peer" />
                                    <div className="w-12 h-7 bg-slate-200 dark:bg-slate-800 rounded-full peer-checked:bg-emerald-500 transition-colors duration-300 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform duration-300 peer-checked:after:translate-x-5 shadow-sm"></div>
                                </div>
                            </label>
                        )}
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 px-6 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed" 
                      disabled={loading}
                    >
                        {loading ? <LoadingSpinner size={20} color="#fff"/> : <><Send size={18}/> {t('post_skill_offer_btn')}</>}
                    </button>

                </form>
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="lg:sticky lg:top-24 w-full">
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">{t('live_preview_title')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{t('live_preview_desc')}</p>
                
                <div className="pointer-events-none origin-top animate-float">
                    <div className="bg-white dark:bg-slate-900 border border-primary-orange/40 dark:border-primary-orange/30 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                            <img src={getPreviewImage()} alt="Preview" className="w-full h-full object-cover" />
                            {isRemote && (
                                <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-lg tracking-wider">{t('remote_work_label')}</div>
                            )}
                        </div>
                        <div className="p-5 flex flex-col gap-3.5">
                            <h3 className="font-extrabold text-slate-800 dark:text-white text-base line-clamp-1">{title || t('your_skill_title')}</h3>
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <User size={14} /> 
                                {isAnonymous ? t('anonymous_user') : user.username}
                            </p>
                            
                            <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/20 text-primary-orange dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-lg">
                                        <Star size={16} fill="#e38b40" stroke="#e38b40" />
                                        <span>{t('new_label')}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{t('zero_reviews')}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {isRemote && <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-lg"><Globe size={12}/> {t('remote_work_label')}</span>}
                                {isAnonymous && <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-lg"><EyeOff size={12}/> {t('post_anonymously_label')}</span>}
                                {isWomenZone && <span className="flex items-center gap-1 px-2.5 py-1 bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 text-[10px] font-bold rounded-lg border border-pink-100 dark:border-pink-950"><Shield size={12}/> {t('women_only_zone_label')}</span>}
                            </div>

                            <button className="w-full py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 rounded-xl transition-all" style={{pointerEvents: 'none', opacity: 0.7}}>
                                {t('view_full_details_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
      
      <SuccessMessageModal
        isOpen={showSuccessModal}
        title={t('skill_posted_success_title')}
        message={t('skill_posted_success_message')}
        onClose={handleSuccessClose}
        type="success"
      />
    </div>
  );
}

export default OfferSkillPage;
