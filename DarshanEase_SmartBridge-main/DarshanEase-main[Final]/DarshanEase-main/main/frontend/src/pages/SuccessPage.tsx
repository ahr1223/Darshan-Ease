import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Calendar } from "lucide-react";
import { PageWrapper } from "@/components/animations";

const SuccessPage = () => {
  const location = useLocation();
  const booking = location.state as any;

  return (
    <PageWrapper>
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg p-8 md:p-12 shadow-card max-w-lg w-full text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-6">Your darshan has been successfully booked</p>

          {booking && (
            <div className="bg-muted rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
              {booking.templeId?.templeName && <p><span className="text-muted-foreground">Temple:</span> <strong>{booking.templeId.templeName}</strong></p>}
              {booking.darshanId?.darshanName && <p><span className="text-muted-foreground">Darshan:</span> <strong>{booking.darshanId.darshanName}</strong></p>}
              {booking.bookingDate && <p><span className="text-muted-foreground">Date:</span> <strong>{booking.bookingDate}</strong></p>}
              {booking.tickets && <p><span className="text-muted-foreground">Tickets:</span> <strong>{booking.tickets} ({booking.ticketType})</strong></p>}
              {booking.price && <p><span className="text-muted-foreground">Amount Paid:</span> <strong className="text-primary">₹{booking.price}</strong></p>}
              {booking._id && <p><span className="text-muted-foreground">Booking ID:</span> <strong className="text-xs font-mono">{booking._id}</strong></p>}
            </div>
          )}

          {/* QR Code */}
          {booking?.qrCode ? (
            <motion.div
              animate={{ boxShadow: ["0 0 20px hsl(27 100% 60% / 0.3)", "0 0 40px hsl(27 100% 60% / 0.6)", "0 0 20px hsl(27 100% 60% / 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-52 h-52 mx-auto mb-8 rounded-lg overflow-hidden border-4 border-primary"
            >
              <img src={booking.qrCode} alt="QR Ticket" className="w-full h-full object-contain bg-white" />
            </motion.div>
          ) : (
            <p className="text-sm text-muted-foreground mb-8">QR code will be sent to your email.</p>
          )}

          <Link to="/dashboard" className="block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 gradient-saffron text-primary-foreground rounded-lg font-semibold shadow-saffron flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> View My Bookings
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default SuccessPage;
