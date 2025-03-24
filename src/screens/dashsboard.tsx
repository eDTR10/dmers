import Dashboard from '@/components/chart/Maturity'

import surveyData from './../assets/data/eReadinessSurveyData.json'

function dashsboard() {
  // Filter data for Camiguin province
  
  // const filteredData = Object.keys(surveyData).reduce((acc, key) => {
  //   // Check if the current key contains an array
  //   if (Array.isArray(surveyData[key])) {
  //     acc[key] = surveyData[key].filter((item: any) => 
  //       item.Province === "Camiguin" ||  item.Province === "Misor")
  //   } else {
  //     // If not an array, keep the original value
  //     acc[key] = surveyData[key];
  //   }

  //   console.log(acc)
    
  //   return acc;
  // }, {} as typeof surveyData);

  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="p-5 w-full h-full flex flex-col bg-card/25 border border-border rounded-lg">
        <h1 className="py-4 px-2 mb-10 rounded-sm text-center font-bold text-xl border text-[#0036C5] border-[#0036C5]">
          Digital Maturity eReadiness Survey Score - Region 10
        </h1>
        
        <Dashboard 
          data={surveyData} 
          
          gridColsBase={4}
        />
      </div>
    </div>
  )
}

export default dashsboard