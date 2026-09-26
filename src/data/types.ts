export interface HeroData {
  readonly headline: string;
  readonly subheadline: string;
  readonly currentStatusBadge: string;
  readonly tickerStrings: readonly string[];
  readonly imageUrl: string;
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnailUrl: string;
  readonly techTags: readonly string[];
  readonly githubLink?: string;
  readonly liveLink?: string;
  readonly architectureHighlights: readonly string[];
}

export interface Experience {
  readonly id: string;
  readonly role: string;
  readonly company: string;
  readonly duration: string;
  readonly achievements: readonly string[];
}

export interface TechCompetencies {
  readonly languages: readonly string[];
  readonly frameworks: readonly string[];
  readonly backendDevOps: readonly string[];
  readonly databases: readonly string[];
}

export interface SocialLink {
  readonly platform: string;
  readonly url: string;
  readonly iconIdentifier?: string;
}

export interface PortfolioData {
  readonly hero: HeroData;
  readonly projects: readonly Project[];
  readonly experience: readonly Experience[];
  readonly competencies: TechCompetencies;
  readonly socials: readonly SocialLink[];
}

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

export interface ContactApiResponse {
  readonly success: boolean;
  readonly message: string;
  readonly error?: string;
}

export type PortfolioMode = 'hyper' | 'boring';

export interface ModeContextType {
  readonly mode: PortfolioMode;
  readonly isTransitioning: boolean;
  readonly toggleMode: () => void;
  readonly setMode: (mode: PortfolioMode) => void;
}

export interface SoundSettings {
  readonly isMuted: boolean;
}

export interface AudioSynthController {
  readonly toggleMute: () => boolean;
  readonly getMuted: () => boolean;
  readonly setMuted: (muted: boolean) => void;
  readonly playHoverBeep: () => void;
  readonly playClickChime: () => void;
  readonly playModeSwitchSound: (toBoring: boolean) => void;
  readonly playOverdriveChime: () => void;
}

export type IntensityStage = 1 | 2 | 3 | 4;

export interface IntensityStageConfig {
  readonly stage: IntensityStage;
  readonly label: string;
  readonly shortName: string;
  readonly description: string;
}

export interface IntensityContextType {
  readonly stage: IntensityStage;
  readonly setStage: (stage: IntensityStage) => void;
  readonly isTransitioning: boolean;
  readonly stageConfigs: Record<IntensityStage, IntensityStageConfig>;
}

export type ColorMode = 'dark' | 'light';

export interface DockRouteItem {
  readonly path: string;
  readonly name: string;
  readonly shortName: string;
  readonly iconIdentifier: string;
  readonly description: string;
  readonly accentColor: string;
  readonly shortcutKey?: string;
}

export interface UseColorModeReturn {
  readonly mode: ColorMode;
  readonly toggleMode: () => void;
  readonly setMode: (mode: ColorMode) => void;
}

export interface UseDockRoutesReturn {
  readonly routes: readonly DockRouteItem[];
  readonly activeRoute: DockRouteItem;
  readonly isActive: (path: string) => boolean;
}

export interface UseAssistantPromptReturn {
  readonly isVisible: boolean;
  readonly dismiss: () => void;
  readonly isRecruiterPage: boolean;
}


