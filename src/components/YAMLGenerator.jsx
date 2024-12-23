import React, { useState } from 'react'

function YAMLGenerator() {
  const [yaml, setYaml] = useState('')

  const generateYAML = () => {
    const exampleConfig = {
      pipeline: 'example-pipeline',
      version: '1.0.0',
      jobs: [
        {
          name: 'job1',
          params: {
            key: 'value',
          },
        },
      ],
    }
    setYaml(JSON.stringify(exampleConfig, null, 2))
  }

  return (
    <div className="p-4">
      <button
        onClick={generateYAML}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate YAML
      </button>
      <pre className="bg-gray-100 p-4 mt-4 rounded">{yaml}</pre>
    </div>
  )
}

export default YAMLGenerator
