/**
 * NotesCard — Molecule
 * Not alma alanı ve kaydetme butonu.
 * @param {string}   value     mevcut metin
 * @param {function} onChange  değişim handler
 * @param {function} onSave    kaydetme handler
 */
import { Card, CardContent, TextField, Button, Typography } from '@mui/material';

const NotesCard = ({ value, onChange, onSave }) => (
  <Card elevation={2}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" fontWeight="medium">Notes</Typography>
      <TextField
        multiline rows={5} fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your notes here..."
        variant="outlined"
      />
      <Button variant="contained" onClick={onSave} sx={{ alignSelf: 'flex-end' }}>
        Save Notes
      </Button>
    </CardContent>
  </Card>
);

export default NotesCard;