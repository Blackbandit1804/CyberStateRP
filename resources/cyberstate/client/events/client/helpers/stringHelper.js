const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

const stringHelper = {
	escapeHtml: (str) => {
		return String(str).replace(/[&<>"'`=\/]/g, function (s) {
			return entityMap[s];
		});
	}
};

export default stringHelper;
