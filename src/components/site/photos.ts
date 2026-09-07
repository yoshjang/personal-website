/**
 * Photo manifest. Files live in public/photos so the exported static site
 * (GitHub Pages) serves them from stable absolute paths.
 * Intrinsic width and height are recorded so the browser reserves space
 * and aspect ratios are preserved.
 */
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

const p = (
  file: string,
  width: number,
  height: number,
  alt: string,
): Photo => ({ src: `/photos/${file}`, width, height, alt });

export const photos = {
  heroPortrait: p(
    "hero-portrait.jpg",
    1534,
    1534,
    "Joshua Wang seated outdoors on grass in a grey polo shirt.",
  ),
  earlyLifeAward: p(
    "early-life-award.jpg",
    1050,
    1400,
    "Joshua Wang holding a competition award certificate beside a trophy.",
  ),
  hsGraduation: p(
    "hs-graduation.jpg",
    996,
    1400,
    "Joshua Wang in graduation cap and gown holding his diploma.",
  ),
  hsTrackMedals: p(
    "hs-track-medals.jpg",
    1400,
    933,
    "Joshua Wang in a Hawks track singlet with medals around his neck, arms outstretched.",
  ),
  hsTrackTeam: p(
    "hs-track-team.jpg",
    1400,
    1050,
    "Four Hawks track athletes standing together on the track with medals.",
  ),
  hsClassEvent: p(
    "hs-class-event.jpg",
    1368,
    912,
    "Students at a school dance in front of illuminated MVCDS letters.",
  ),
  hsSoccer: p(
    "hs-soccer.jpg",
    1400,
    933,
    "Joshua Wang with teammates in soccer uniforms on the field.",
  ),
  researchLab: p(
    "research-lab.jpg",
    894,
    1400,
    "Joshua Wang in a white lab coat, safety glasses, and gloves working with a sample at a bench.",
  ),
  researchCleanroom: p(
    "research-cleanroom.jpg",
    1050,
    1400,
    "A researcher in full cleanroom coveralls working at a microscope station.",
  ),
  researchSolar: p(
    "research-solar.jpg",
    1050,
    1400,
    "A researcher in protective gear and gloves reaching into a laboratory glovebox enclosure.",
  ),
  researchEquipment: p(
    "research-equipment.jpg",
    1400,
    1050,
    "Joshua Wang at a lab workstation with instrument software displayed on two monitors.",
  ),
  researchNano: p(
    "research-nano.jpg",
    1400,
    1049,
    "Joshua Wang receiving a certificate on stage at a Penn Engineering nanotechnology program ceremony.",
  ),
  researchPoster: p(
    "research-poster-preview.jpg",
    1400,
    1050,
    "Preview of a research poster with methods text, plots, and results panels.",
  ),
  toledoGroup: p(
    "toledo-group.jpg",
    1400,
    1049,
    "A large group of camp children holding certificates in front of balloon decorations.",
  ),
  toledoBasketball: p(
    "toledo-basketball.jpg",
    1113,
    980,
    "Children lined up in a gym at the Alex and Joshua basketball workshop, dated 2 December 2023 at MVCDS.",
  ),
  toledoService: p(
    "toledo-service.jpg",
    720,
    416,
    "Volunteers standing outdoors holding filled bags of collected litter.",
  ),
  toledoBaptism: p(
    "toledo-baptism.jpg",
    829,
    465,
    "Joshua Wang stepping out of a baptismal pool alongside a church minister.",
  ),
  nowDukeGroup: p(
    "now-duke-group.jpg",
    1400,
    1051,
    "A group of students in business attire posing on chapel steps.",
  ),
  nowCampus: p(
    "now-campus.jpg",
    1050,
    1400,
    "Joshua Wang with two friends at an outdoor Duke sporting event.",
  ),
  nowFriends: p(
    "now-friends.jpg",
    1400,
    1050,
    "Joshua Wang and three friends indoors holding stacked takeout containers.",
  ),
  nowBasketball: p(
    "now-basketball.jpg",
    787,
    1400,
    "Joshua Wang and two others standing on a Duke basketball court under the hoop.",
  ),
} satisfies Record<string, Photo>;
