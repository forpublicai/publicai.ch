// TeamGrid: portrait cards for the team page —
// image, name, optional role line (: roles pending user confirmation;
// the prop stays optional so content lands as verified). Images are
// site-absolute paths (link-checker territory,). `linkedin` is an
// optional absolute profile URL; when set, the name itself links to it
// (no visible "LinkedIn" label, only in the accessible name).
export type TeamMember = {
  name: string;
  image?: string;
  role?: string;
  linkedin?: string;
};

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <ul className="team-grid">
      {members.map((member) => (
        <li key={member.name} className="team-card">
          {member.image ? (
            <img src={member.image} alt={`Portrait: ${member.name}`} className="team-card__image" loading="lazy" />
          ) : (
            <span aria-hidden="true" className="team-card__placeholder">
              {member.name
                .split(" ")
                .map((part) => part[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")}
            </span>
          )}
          <div className="team-card__body">
            <p className="team-card__name">
              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  className="team-card__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} – LinkedIn`}
                >
                  {member.name}
                </a>
              ) : (
                member.name
              )}
            </p>
            {member.role ? <p className="team-card__role">{member.role}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}