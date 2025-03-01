import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectCommonState } from "../../redux/common/selectors";
import { hideAlert } from "../../redux/common/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";

const alertStyles: Record<string, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
  warning: "bg-yellow-500 text-black",
};

const Alert = ({ alert, hide }: { alert: any; hide: (arg: any) => void }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    if (alert?.show) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        dispatch(hideAlert())
      }, alert.duration || 3000); // Default 3s

      return () => clearTimeout(timer);
    }
  }, [alert, hide]);

  return (
    <AnimatePresence>
      {alert?.show && visible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            alertStyles[alert.type] || "bg-gray-500 text-white"
          }`}
        >
          <span className="font-medium">{alert.message}</span>
          <button
            onClick={() => {
              setVisible(false);
              dispatch(hideAlert())
            }}
            className="ml-4 bg-black bg-opacity-20 px-2 py-1 rounded-full text-sm hover:bg-opacity-30 transition"
          >
            ✖
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const mapStateToProps = (state: any) => {
  const { alert } = selectCommonState(state);
  return { alert };
};

const mapDispatchToProps = (dispatch: any) => ({
  hide: () => dispatch(hideAlert()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
