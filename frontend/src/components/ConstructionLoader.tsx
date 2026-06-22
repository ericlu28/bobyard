// Loading indicator: a bulldozer drives across, building up a dirt fill as it
// goes. Loops while the comments are being fetched (indeterminate progress).
function ConstructionLoader() {
  return (
    <div className="dozer-loader" role="status" aria-label="Loading comments">
      <div className="dozer-scene">
        <div className="dozer-fill" />
        <span className="dozer">🚜</span>
      </div>
      <div className="dozer-ground" />
      <span className="dozer-text">Building your comments…</span>
    </div>
  )
}

export default ConstructionLoader
