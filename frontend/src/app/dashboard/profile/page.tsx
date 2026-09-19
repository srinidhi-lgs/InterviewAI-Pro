'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { API_URL } from '@/lib/api';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Edit2, Loader2, Save, X, Plus, Trash2, Link as LinkIcon, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  headline: z.string().optional().nullable(),
  phone: z.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, "Must be a valid Indian phone number").optional().or(z.literal('')).nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional().nullable(),
  location: z.string().optional().nullable(),
  college: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
  cgpa: z.coerce.number().min(0, "CGPA must be at least 0").max(10, "CGPA must be at most 10").optional().nullable(),
  graduationYear: z.coerce.number().min(2000, "Graduation year must be at least 2000").max(2100, "Must be at most 2100").optional().nullable(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')).nullable(),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')).nullable(),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')).nullable(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { accessToken } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      fullName: '',
      headline: '',
      phone: '',
      dateOfBirth: '',
      gender: 'PREFER_NOT_TO_SAY',
      location: '',
      college: '',
      degree: '',
      branch: '',
      cgpa: null,
      graduationYear: null,
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      bio: ''
    }
  });

  const watchAllFields = watch();

  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const data = res.data?.data || res.data;
      reset({
        fullName: data.fullName || '',
        headline: data.headline || '',
        phone: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'PREFER_NOT_TO_SAY',
        location: data.location || '',
        college: data.college || '',
        degree: data.degree || '',
        branch: data.branch || '',
        cgpa: data.cgpa || null,
        graduationYear: data.graduationYear || null,
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        bio: data.bio || ''
      });
      
      setProfileImage(data.profileImageUrl || null);
      
      if (data.skills) {
        try {
          // If stored as JSON string or comma separated
          if (data.skills.startsWith('[')) {
            setSkills(JSON.parse(data.skills));
          } else {
            setSkills(data.skills.split(',').map((s: string) => s.trim()).filter(Boolean));
          }
        } catch (e) {
          setSkills(data.skills.split(',').map((s: string) => s.trim()).filter(Boolean));
        }
      }
      
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404 || err.response?.status === 204) {
        // No profile exists yet
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        phoneNumber: data.phone,
        dateOfBirth: data.dateOfBirth || null,
        skills: JSON.stringify(skills)
      };
      
      const res = await axios.put(`${API_URL}/profile`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const responseData = res.data?.data || res.data;
      reset({
        fullName: responseData.fullName || '',
        headline: responseData.headline || '',
        phone: responseData.phoneNumber || '',
        dateOfBirth: responseData.dateOfBirth || '',
        gender: responseData.gender || 'PREFER_NOT_TO_SAY',
        location: responseData.location || '',
        college: responseData.college || '',
        degree: responseData.degree || '',
        branch: responseData.branch || '',
        cgpa: responseData.cgpa || null,
        graduationYear: responseData.graduationYear || null,
        linkedinUrl: responseData.linkedinUrl || '',
        githubUrl: responseData.githubUrl || '',
        portfolioUrl: responseData.portfolioUrl || '',
        bio: responseData.bio || ''
      });
      
      setToast({ message: 'Profile Updated Successfully', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'Image must be less than 5MB', type: 'error' });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploadingImage(true);
    try {
      const res = await axios.post(`${API_URL}/profile/image`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setProfileImage(res.data.profileImageUrl);
      setToast({ message: 'Profile picture updated', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to upload image', type: 'error' });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageDelete = async () => {
    setIsUploadingImage(true);
    try {
      await axios.delete(`${API_URL}/profile/image`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      setProfileImage(null);
      setToast({ message: 'Profile picture removed', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to remove image', type: 'error' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isEditing) return;
      const newSkill = skillInput.trim();
      if (newSkill && !skills.includes(newSkill) && skills.length < 30) {
        setSkills([...skills, newSkill]);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (!isEditing) return;
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const calculateCompletion = () => {
    const sections = [
      profileImage ? 10 : 0, // Photo
      (watchAllFields.fullName && watchAllFields.phone && watchAllFields.location) ? 30 : 0, // Basic Info
      (watchAllFields.college && watchAllFields.degree) ? 20 : 0, // Education
      (skills.length > 0) ? 20 : 0, // Skills
      (watchAllFields.linkedinUrl || watchAllFields.githubUrl) ? 10 : 0, // Links
      (watchAllFields.bio) ? 10 : 0 // Bio
    ];
    return sections.reduce((a, b) => a + b, 0);
  };

  const completionPercentage = calculateCompletion();
  
  // Need to prefix image URL with the backend base URL if it's relative
  const backendBase = API_URL.replace('/api/v1', '');
  const displayImageUrl = profileImage ? (profileImage.startsWith('http') ? profileImage : `${backendBase}${profileImage}`) : null;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 space-y-8 pb-24">
      {/* Header section with completion & actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-6">
          <div className="relative">
            {displayImageUrl ? (
              <img src={displayImageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold border-2 border-indigo-50 dark:border-indigo-900/10">
                {getInitials(watchAllFields.fullName || 'User')}
              </div>
            )}
            
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                {profileImage && (
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    disabled={isUploadingImage}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/jpeg,image/png,image/webp" 
              className="hidden" 
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {watchAllFields.fullName || 'Complete Your Profile'}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {watchAllFields.headline || 'Add a professional headline'}
            </p>
            
            <div className="mt-3 flex items-center gap-3">
              <div className="w-32 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-in-out" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {completionPercentage}% Complete
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setIsEditing(false);
                }}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Personal Information */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name *</label>
              <input
                {...register('fullName')}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Headline</label>
              <input
                {...register('headline')}
                disabled={isSaving}
                placeholder="e.g. Software Engineer at Tech Co"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone</label>
              <input
                {...register('phone')}
                disabled={isSaving}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label>
              <input
                {...register('location')}
                disabled={isSaving}
                placeholder="City, Country"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Date of Birth</label>
              <input
                type="date"
                {...register('dateOfBirth')}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Gender</label>
              <select
                {...register('gender')}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">College / University</label>
              <input
                {...register('college')}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Degree</label>
              <input
                {...register('degree')}
                disabled={isSaving}
                placeholder="e.g. B.Tech, B.Sc"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Branch</label>
              <input
                {...register('branch')}
                disabled={isSaving}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">CGPA</label>
              <input
                type="number"
                step="0.01"
                {...register('cgpa')}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.cgpa && <p className="text-xs text-red-500">{errors.cgpa.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Graduation Year</label>
              <input
                type="number"
                {...register('graduationYear')}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.graduationYear && <p className="text-xs text-red-500">{errors.graduationYear.message}</p>}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Skills</h2>
          <div className="space-y-4">
            {isEditing && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Add Skill</label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    disabled={skills.length >= 30}
                    placeholder="Type a skill and press Enter"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={(e) => addSkill({ key: 'Enter', preventDefault: () => {} } as any)}
                    disabled={!skillInput.trim() || skills.length >= 30}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-zinc-500">{skills.length}/30 skills added</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {skills.length === 0 && !isEditing && (
                <span className="text-sm text-zinc-500 italic">No skills added yet.</span>
              )}
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Professional Links</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">LinkedIn URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  {...register('linkedinUrl')}
                  disabled={isSaving}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              {errors.linkedinUrl && <p className="text-xs text-red-500">{errors.linkedinUrl.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GitHub URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  {...register('githubUrl')}
                  disabled={isSaving}
                  placeholder="https://github.com/username"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              {errors.githubUrl && <p className="text-xs text-red-500">{errors.githubUrl.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Portfolio URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  {...register('portfolioUrl')}
                  disabled={isSaving}
                  placeholder="https://yourwebsite.com"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              {errors.portfolioUrl && <p className="text-xs text-red-500">{errors.portfolioUrl.message}</p>}
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Bio</h2>
          <div className="space-y-1">
            <textarea
              {...register('bio')}
              disabled={isSaving}
              rows={5}
              placeholder="Tell us a little about yourself..."
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{errors.bio?.message || ''}</span>
              <span>{(watchAllFields.bio || '').length}/500</span>
            </div>
          </div>
        </section>
        
      </form>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl font-medium text-sm flex items-center gap-2 z-50 ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? '✓' : '⚠'} {toast.message}
        </motion.div>
      )}
    </div>
  );
}
