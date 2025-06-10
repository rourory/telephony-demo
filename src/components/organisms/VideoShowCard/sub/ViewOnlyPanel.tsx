export const ViewOnlyPanel = () => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          height: '50%',
          width: '100%',
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: 'absolute',
          height: '25%',
          width: '100%',
          zIndex: 40,
          bottom: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          height: '25%',
          width: '40%',
          zIndex: 40,
          top: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          height: '25%',
          width: '40%',
          zIndex: 40,
          right: 0,
          top: '50%',
        }}
      />
    </>
  );
};
