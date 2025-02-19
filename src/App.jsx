import React, { useState } from 'react';
import { Flame, Zap, Mountain, Waves, Wind, Plus, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';

const JobTypeIcons = {
  subbanding_MS: { 
    icon: Flame, 
    color: 'from-red-500 to-orange-500', 
    border: 'border-red-500/20', 
    text: 'Fire Type',
    description: 'Subbanding & Data Split'
  },
  flagging_MS: { 
    icon: Zap, 
    color: 'from-yellow-400 to-yellow-500', 
    border: 'border-yellow-500/20', 
    text: 'Electric Type',
    description: 'Data Flagging'
  },
  calibrating_MS: { 
    icon: Mountain, 
    color: 'from-amber-700 to-amber-800', 
    border: 'border-amber-500/20', 
    text: 'Ground Type',
    description: 'Calibration'
  },
  applying_calibration_MS: { 
    icon: Waves, 
    color: 'from-blue-500 to-blue-600', 
    border: 'border-blue-500/20', 
    text: 'Water Type',
    description: 'Apply Calibration'
  },
  imaging_MS: { 
    icon: Wind, 
    color: 'from-cyan-400 to-cyan-500', 
    border: 'border-cyan-500/20', 
    text: 'Flying Type',
    description: 'Imaging'
  }
};

const jobTemplates = {
  subbanding_MS: {
    description: "Subbanding the measurement set and creating directories.",
    params: {
      parent_ms: "rcs.ms",
      calibrator_ms: "cal.ms",
      source_ms: "src.ms",
      spw_structure: {
        spw0: "0:124~573",
        spw1: "0:574~1023",
        spw2: "0:1024~1473",
        spw3: "0:1474~1923"
      },
      calibrator_list: "3C286,3C48,1634+627",
      source_list: "RXCS",
      datacolumn: "DATA"
    }
  },
  flagging_MS: {
    description: "Flagging of visibilities",
    params: {
      input_ms: "src.ms",
      flag_spw: {
        spw0: "0",
        spw1: "0",
        spw2: "0",
        spw3: "0"
      },
      field: "RXCS",
      datacolumn: "DATA",
      mode: "tfcrop",
      ntime: "2min",
      uvrange: "",
      wait_to_end: false,
      a_cal: false
    }
  },
  calibrating_MS: {
    description: "Getting calibrator solutions",
    params: {
      input_ms: "cal.ms",
      cal_spw: {
        spw0: "0",
        spw1: "0",
        spw2: "0",
        spw3: "0"
      },
      amp_cal: "3C286,3C48",
      phase_cal: "1634+627",
      file_prefix: "sol_1",
      min_snr: 3,
      sol_int: ["int", "120s", "inf", "120s"],
      ref_ant: "C02"
    }
  },
  applying_calibration_MS: {
    description: "Applying calibrator solutions",
    params: {
      input_ms: ["cal.ms", "cal.ms", "cal.ms"],
      solution_spw: {
        spw0: "0",
        spw1: "0",
        spw2: "0",
        spw3: "0"
      },
      file_prefix: "sol_1",
      a_cal: true,
      check_any_flagjobs_pending: true
    }
  }
};

const YAMLGenerator = () => {
  const [generalConfig, setGeneralConfig] = useState({
    working_directory: "./",
    PBS_or_SLURM: "PBS",
    casa_dir: "/home/apal/casa-6.6.4-34-py3.8.el8"
  });

  const [jobs, setJobs] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);

  const addJob = (type) => {
    const newJob = {
      name: type,
      description: jobTemplates[type].description,
      params: JSON.parse(JSON.stringify(jobTemplates[type].params))
    };
    setJobs([...jobs, newJob]);
  };

  const updateJobParam = (jobIndex, path, value) => {
    const newJobs = [...jobs];
    let target = newJobs[jobIndex].params;
    const pathParts = path.split('.');
    
    let current = target;
    for(let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;
    
    setJobs(newJobs);
  };

  const generateYAML = () => {
    const yaml = `# Radio Astronomy Pipeline Configuration
# Generated by Charizard YAML Generator

general:
  working_directory: "${generalConfig.working_directory}"     # Base directory for outputs
  PBS_or_SLURM: "${generalConfig.PBS_or_SLURM}"              # Job scheduler type
  casa_dir: "${generalConfig.casa_dir}"                      # CASA installation path

jobs:
${jobs.map(job => `  - name: "${job.name}"
    description: |
      ${job.description}
    steps:
      - run_${job.name.toLowerCase()}:
${Object.entries(job.params).map(([key, value]) => 
            `          ${key}: ${JSON.stringify(value)}`
          ).join('\n')}`).join('\n\n')}

run_jobs:
${jobs.map(job => `  - ${job.name}`).join('\n')}`;

    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline_config.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/5 rounded-full w-64 h-64 blur-3xl -top-32 -right-32"></div>
          <div className="absolute inset-0 bg-blue-500/5 rounded-full w-48 h-48 blur-2xl -bottom-24 -left-24"></div>

          <div className="mb-8 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-lg">
            <div className="border-b border-gray-700/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                    <div className="h-6 w-6 text-white">⚡</div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Pokedex Generator</h3>
                    <p className="text-gray-400 text-sm">General Configuration</p>
                  </div>
                </div>
                <button 
                  onClick={generateYAML}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Get Your Pokedex
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {Object.entries(generalConfig).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </label>
                  {key === 'PBS_or_SLURM' ? (
                    <select
                      value={value}
                      onChange={(e) => setGeneralConfig({...generalConfig, [key]: e.target.value})}
                      className="w-full bg-gray-700/50 border-gray-600 text-white rounded-lg p-2"
                    >
                      <option value="PBS">PBS</option>
                      <option value="SLURM">SLURM</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setGeneralConfig({...generalConfig, [key]: e.target.value})}
                      className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(JobTypeIcons).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => addJob(type)}
                  className={`bg-gradient-to-r ${config.color} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:scale-105`}
                >
                  <Plus className="h-4 w-4" />
                  {config.description}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div 
                key={index}
                onClick={() => setExpandedJob(expandedJob === index ? null : index)}
                className={`bg-gray-800/50 backdrop-blur-xl border ${JobTypeIcons[job.name].border} rounded-lg shadow-2xl cursor-pointer`}
              >
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`bg-gradient-to-br ${JobTypeIcons[job.name].color} p-3 rounded-xl`}>
                        {React.createElement(JobTypeIcons[job.name].icon, { className: "h-6 w-6 text-white" })}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{job.name}</h3>
                        <p className="text-gray-400 text-sm">{JobTypeIcons[job.name].text}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newJobs = [...jobs];
                          newJobs.splice(index, 1);
                          setJobs(newJobs);
                        }}
                        className="text-gray-400 hover:text-white p-2 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedJob(expandedJob === index ? null : index);
                        }}
                        className="text-gray-400 hover:text-white p-2 rounded-lg"
                      >
                        {expandedJob === index ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {expandedJob === index && (
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(job.params).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </label>
                          {typeof value === 'object' && !Array.isArray(value) ? (
                            <div className="space-y-2">
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <div key={subKey}>
                                  <label className="block text-xs text-gray-400 mb-1">
                                    {subKey}
                                  </label>
                                  <input
                                    type="text"
                                    value={subValue}
                                    onChange={(e) => updateJobParam(index, `${key}.${subKey}`, e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={Array.isArray(value) ? value.join(',') : value}
                              onChange={(e) => updateJobParam(index, key, 
                                Array.isArray(value) ? e.target.value.split(',') : e.target.value
                              )}
                              className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YAMLGenerator;