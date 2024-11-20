
export default async function SDAClimateCaseStudyServerPage() {
  const caseStudyName = "climate-monitoring";
  const tracerID = "test";
  const jobID = 1;


  return (
    <div>
      <h1>Climate Monitoring</h1>
      <p>Tracer ID: {tracerID}</p>
      <p>Job ID: {jobID}</p>
    </div>
  );
}
