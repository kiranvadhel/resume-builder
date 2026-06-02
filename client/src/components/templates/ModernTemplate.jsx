import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="resume-container max-w-4xl mx-auto bg-white text-gray-800">
      
      {/* Header + Content SAME WRAPPER (IMPORTANT FIX) */}
      <div className="p-6">

        {/* Header */}
        <header
          className="p-6 text-white rounded"
          style={{ backgroundColor: accentColor }}
        >
          <h1 className="text-3xl font-light mb-3">
            {data.personal_info?.full_name || "Your Name"}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {data.personal_info?.email && (
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <span>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4" />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <a
                target="_blank"
                href={data.personal_info.linkedin}
                className="flex items-center gap-2"
              >
                <Linkedin className="size-4" />
                <span className="break-all text-xs">
                  {data.personal_info.linkedin.replace("https://www.", "")}
                </span>
              </a>
            )}
            {data.personal_info?.website && (
              <a
                target="_blank"
                href={data.personal_info.website}
                className="flex items-center gap-2"
              >
                <Globe className="size-4" />
                <span className="break-all text-xs">
                  {data.personal_info.website.replace("https://", "")}
                </span>
              </a>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="mt-6">

          {/* Summary */}
          {data.professional_summary && (
            <section className="mb-6">
              <h2 className="text-xl font-light mb-2 border-b">
                Professional Summary
              </h2>
              <p>{data.professional_summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-light mb-3 border-b">
                Experience
              </h2>

              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i} className="pl-4 border-l">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{exp.position}</h3>
                        <p style={{ color: accentColor }}>{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-sm mt-2 whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.project?.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-light mb-2 border-b">
                Projects
              </h2>

              {data.project.map((p, i) => (
                <div key={i} className="pl-4 border-l mb-3">
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-sm mt-1">{p.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education + Skills */}
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Education */}
            {data.education?.length > 0 && (
              <section>
                <h2 className="text-xl font-light mb-2 border-b">
                  Education
                </h2>

                {data.education.map((edu, i) => (
                  <div key={i} className="mb-2">
                    <h3 className="font-medium">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p style={{ color: accentColor }}>{edu.institution}</p>
                    <span className="text-sm text-gray-500">
                      {formatDate(edu.graduation_date)}
                    </span>
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {data.skills?.length > 0 && (
              <section>
                <h2 className="text-xl font-light mb-2 border-b">
                  Skills
                </h2>

                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs text-white rounded"
                      style={{ backgroundColor: accentColor }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;