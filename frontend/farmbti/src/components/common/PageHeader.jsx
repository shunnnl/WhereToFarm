import headerBackground from "../../asset/common/header-background.png";

const PageHeader = ({ title, description }) => {
  return (
    <div className="relative w-full">
      <img
        src={headerBackground}
        alt="Header background"
        className="w-full h-auto"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-center">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;
