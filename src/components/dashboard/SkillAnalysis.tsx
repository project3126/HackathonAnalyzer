import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { resumeAPI, jobRoleAPI, progressAPI } from '../../services/api';
import { Upload, FileText, Target, TrendingUp, CheckCircle, X } from 'lucide-react';

export default function SkillAnalysis() {
  const { user, updateUser } = useAuth();
  const { skillGaps } = useData();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(!!user?.profileComplete);
  const [showUpload, setShowUpload] = useState(!user?.profileComplete);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [skillGapData, setSkillGapData] = useState<any>(null);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    fetchAvailableRoles();
  }, []);

  const fetchAvailableRoles = async () => {
    try {
      const response = await jobRoleAPI.getJobRoles();
      if (response.data.success) {
        setAvailableRoles(response.data.jobRoles);
      }
    } catch (error) {
      console.error('Error fetching job roles:', error);
    }
  };

  const currentSkills = user?.skills || ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'];
  const desiredRole = user?.desiredRole || 'Senior Full Stack Developer';
  
  const requiredSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Docker', 
    'AWS', 'System Design', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL'
  ];

  const skillMatch = currentSkills.filter(skill => 
    requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  );

  const missingSkills = requiredSkills.filter(skill => 
    !currentSkills.some(current => current.toLowerCase().includes(skill.toLowerCase()))
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('resume', file);
        
        const response = await resumeAPI.upload(formData);
        if (response.data.success) {
          setAnalysisComplete(true);
          updateUser({ profileComplete: true });
          setShowUpload(false);
          
          // Auto-analyze skills if role is selected
          if (selectedRole) {
            await analyzeSkills(selectedRole);
          }
        }
      } catch (error) {
        console.error('Resume upload error:', error);
        alert('Failed to upload resume. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const analyzeSkills = async (roleId: string) => {
    setAnalyzing(true);
    try {
      // Get role skills
      const roleResponse = await jobRoleAPI.getJobRoleSkills(roleId);
      if (roleResponse.data.success) {
        const roleSkills = roleResponse.data.skills;
        
        // Analyze skill gap
        const response = await resumeAPI.analyzeSkills(roleResponse.data.roleTitle);
        if (response.data.success) {
          setSkillGapData({
            ...response.data.analysis,
            roleSkills: roleSkills
          });
          
          // Update progress tracking
          await progressAPI.updateSkillProgress('overall', {
            currentLevel: response.data.analysis.matchPercentage
          });
        }
      }
    } catch (error) {
      console.error('Skill analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRoleSelection = async (roleId: string) => {
    setSelectedRole(roleId);
    if (analysisComplete) {
      await analyzeSkills(roleId);
    }
  };

  const skillCategories = [
    { name: 'Frontend', skills: ['JavaScript', 'TypeScript', 'React'], color: 'blue' },
    { name: 'Backend', skills: ['Node.js', 'Python', 'GraphQL'], color: 'green' },
    { name: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Redis'], color: 'purple' },
    { name: 'DevOps', skills: ['Docker', 'AWS', 'System Design'], color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h2>
          <p className="text-gray-600">Discover what skills you need to reach your goals</p>
        </div>
        {analysisComplete && (
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Update Resume</span>
          </button>
        )}
      </div>

      {showUpload ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
            <p className="text-gray-600 mb-6">
              Upload your resume to get a personalized skill analysis and learning recommendations
            </p>
            
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                <FileText className="w-12 h-12 text-blue-500" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your resume here or click to upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                    {uploading && (
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600 text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Matching Skills</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {skillGapData?.matchingSkills?.length || skillMatch.length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Skill Gaps</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">
                    {skillGapData?.missingSkills?.length || missingSkills.length}
                  </p>
                </div>
                <Target className="w-10 h-10 text-red-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Match Rate</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {skillGapData?.matchPercentage || Math.round((skillMatch.length / requiredSkills.length) * 100)}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Role Analysis */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Role Selection</h3>
            
            {/* Role Selection Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Target Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleSelection(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a role...</option>
                {availableRoles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.title} ({role.level} - {role.category})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedRole && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Target Role</p>
                  <p className="text-xl font-bold text-gray-900">
                    {availableRoles.find(r => r._id === selectedRole)?.title || 'Loading...'}
                  </p>
                  {analyzing && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-blue-600 text-sm">Analyzing skills...</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Readiness Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {skillGapData?.matchPercentage || Math.round((skillMatch.length / requiredSkills.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Skill Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h4 className={`text-lg font-semibold mb-4 text-${category.color}-700`}>
                  {category.name} Skills
                </h4>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => {
                    const hasSkill = skillGapData?.matchingSkills?.includes(skill) || currentSkills.includes(skill);
                    return (
                      <div key={skillIndex} className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">{skill}</span>
                        {hasSkill ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Have</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <X className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-red-600 font-medium">Need</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Action Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Priority Skills to Learn</h4>
                <div className="space-y-2">
                  {(skillGapData?.missingSkills || missingSkills).slice(0, 3).map((skill: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 text-sm">{skill.skill || skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Your Strengths</h4>
                <div className="space-y-2">
                  {(skillGapData?.matchingSkills || skillMatch).slice(0, 3).map((skill: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}