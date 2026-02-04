import { Composition } from "remotion"
import { PromoVideo } from "./PromoVideo"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={450} // 15 seconds at 30fps (2x faster)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
