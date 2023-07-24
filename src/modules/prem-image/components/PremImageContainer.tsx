import { useCallback, useState } from "react";
import PremImageLeftSidebar from "./PremImageLeftSidebar";
import Header from "./Header";
import clsx from "clsx";
import PremImageRightSidebar from "./PremImageRightSidebar";
import usePremImage from "shared/hooks/usePremImage";
import DownloadIcon from "shared/components/DownloadIcon";
import DeleteIconNew from "shared/components/DeleteIconNew";
import { useNavigate } from "react-router-dom";
import PremImagePromptBox from "./PremImagePromptBox";
import { PremImageContainerProps } from "../types";
import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import "yet-another-react-lightbox/styles.css";
import { useMediaQuery } from "usehooks-ts";

const PremImageContainer = ({ serviceName, historyId, serviceId }: PremImageContainerProps) => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const responsiveMatches = useMediaQuery("(max-width: 767px)");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    isLoading,
    onSubmit,
    prompt,
    setPrompt,
    currentHistory,
    deleteHistory,
    negativePrompt,
    setNegativePrompt,
    file,
    setFile,
  } = usePremImage(serviceId, historyId);

  const onDeleteClick = () => {
    deleteHistory(historyId as string);
    navigate(`/prem-image/${serviceId}`);
  };

  const handleClickOnImg = (index: number) => {
    setIndex(index);
    setOpen(true);
  };

  const generateImages = useCallback(() => {
    if (!prompt) return;
    onSubmit();
  }, [prompt, onSubmit]);

  const plugins = responsiveMatches ? [Inline] : [];

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <div className={clsx("prem-chat-sidebar md:relative", hamburgerMenuOpen && "maxMd:hidden")}>
          <PremImageLeftSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div className="main-content h-full z-10 overflow-y-auto custom-scroll relative prem-img-services min-h-screen">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <PremImagePromptBox
                prompt={prompt}
                setPrompt={setPrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                isLoading={isLoading}
                generateImages={generateImages}
                setFile={setFile}
                file={file}
              />

              <div className="prem-img-services__container">
                {currentHistory && (
                  <div className="ml-auto text-right py-4">
                    <button className="px-2" onClick={onDeleteClick}>
                      <DeleteIconNew />
                    </button>
                  </div>
                )}
                <div className="gallery gap-[13px] maxMd:hidden">
                  {currentHistory?.images.map((image, index: number) => {
                    return (
                      <div
                        onClick={() => handleClickOnImg(index)}
                        data-cols={index}
                        className={clsx("relative prem-img__box", {
                          [`gridcol${index + 1}`]: index > 0,
                        })}
                        key={index}
                      >
                        <img src={image} className="w-full" />
                        <a href={image} download onClick={(e) => e.stopPropagation()}>
                          <DownloadIcon />
                        </a>
                      </div>
                    );
                  })}
                </div>
                <Lightbox
                  plugins={plugins}
                  inline={{ style: { width: "100%", aspectRatio: "3 / 2" } }}
                  open={open}
                  close={() => setOpen(false)}
                  slides={currentHistory?.images.map((img) => ({ src: img }))}
                  index={index}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          {rightSidebar && (
            <PremImageRightSidebar isLoading={isLoading} setRightSidebar={setRightSidebar} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PremImageContainer;
