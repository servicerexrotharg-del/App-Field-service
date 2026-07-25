import { DayWorkLog, TechnicianAssignment, HourBreakdown } from '../types';

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function formatMinutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

export function formatHoursLabel(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h} hs`;
  return `${h} hs ${m} min`;
}

interface SingleDayCalculation {
  totalTrabajoMinutes: number;
  normalesMinutes: number;
  extras50Minutes: number;
  extras100Minutes: number;
}

/**
 * Calculates work hours for a single day interval [ingreso, egreso] according to legislation.
 */
export function calculateDayHours(log: DayWorkLog): SingleDayCalculation {
  if (!log.horaIngreso || !log.horaEgreso) {
    return { totalTrabajoMinutes: 0, normalesMinutes: 0, extras50Minutes: 0, extras100Minutes: 0 };
  }

  const startMin = parseTimeToMinutes(log.horaIngreso);
  let endMin = parseTimeToMinutes(log.horaEgreso);

  // Handle overnight shift (e.g., 22:00 to 06:00)
  if (endMin <= startMin && endMin > 0) {
    endMin += 24 * 60;
  }

  const totalMinutes = Math.max(0, endMin - startMin);

  // If holiday (feriado), ALL worked hours are Extras 100%
  if (log.esFeriado) {
    return {
      totalTrabajoMinutes: totalMinutes,
      normalesMinutes: 0,
      extras50Minutes: 0,
      extras100Minutes: totalMinutes,
    };
  }

  // Check day of week
  let isSunday = false;
  let isSaturday = false;
  if (log.fecha) {
    const dateObj = new Date(log.fecha + 'T00:00:00');
    const dayOfWeek = dateObj.getDay(); // 0: Sun, 6: Sat
    if (dayOfWeek === 0) isSunday = true;
    if (dayOfWeek === 6) isSaturday = true;
  }

  if (isSunday) {
    return {
      totalTrabajoMinutes: totalMinutes,
      normalesMinutes: 0,
      extras50Minutes: 0,
      extras100Minutes: totalMinutes,
    };
  }

  let normales = 0;
  let extras50 = 0;
  let extras100 = 0;

  // Step through minute by minute or interval
  for (let m = startMin; m < endMin; m += 15) {
    const interval = Math.min(15, endMin - m);
    const timeOfDay = m % (24 * 60); // 0..1439

    if (isSaturday) {
      // Saturday: before 13:00 -> Normales? Saturday before 13:00 usually normal or 50%. Standard is normal up to 13:00, 50% after 13:00 until 21:00, 100% after 21:00
      if (timeOfDay < 13 * 60) {
        normales += interval;
      } else if (timeOfDay < 21 * 60) {
        extras50 += interval;
      } else {
        extras100 += interval;
      }
    } else {
      // Monday - Friday
      // Normal: 07:00 to 18:00 (420 to 1080)
      // Extras 50%: 18:00 to 21:00 (1080 to 1260)
      // Extras 100%: 21:00 to 06:00 (1260 to 1440, and 0 to 360)
      if (timeOfDay >= 7 * 60 && timeOfDay < 18 * 60) {
        normales += interval;
      } else if (timeOfDay >= 18 * 60 && timeOfDay < 21 * 60) {
        extras50 += interval;
      } else {
        extras100 += interval;
      }
    }
  }

  return {
    totalTrabajoMinutes: totalMinutes,
    normalesMinutes: normales,
    extras50Minutes: extras50,
    extras100Minutes: extras100,
  };
}

/**
 * Calculates complete breakdown of hours per role and total.
 */
export function calculateReportHourBreakdown(
  logs: DayWorkLog[],
  techs: TechnicianAssignment[]
): HourBreakdown {
  const result: HourBreakdown = {
    especialista: { viaje: 0, normales: 0, extras50: 0, extras100: 0, cantidadTecnicos: 0 },
    tecnico: { viaje: 0, normales: 0, extras50: 0, extras100: 0, cantidadTecnicos: 0 },
    ayudante: { viaje: 0, normales: 0, extras50: 0, extras100: 0, cantidadTecnicos: 0 },
    totalViaje: 0,
    totalTrabajo: 0,
    totalNormales: 0,
    totalExtras50: 0,
    totalExtras100: 0,
  };

  // Find max technician counts declared for each category
  techs.forEach((t) => {
    const roleKey = t.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (roleKey.includes('especialista')) {
      result.especialista.cantidadTecnicos = Math.max(result.especialista.cantidadTecnicos, t.cantidad);
    } else if (roleKey.includes('ayudante')) {
      result.ayudante.cantidadTecnicos = Math.max(result.ayudante.cantidadTecnicos, t.cantidad);
    } else if (roleKey.includes('tecnico')) {
      result.tecnico.cantidadTecnicos = Math.max(result.tecnico.cantidadTecnicos, t.cantidad);
    }
  });

  logs.forEach((log) => {
    const single = calculateDayHours(log);
    const normHs = formatMinutesToHours(single.normalesMinutes);
    const ex50Hs = formatMinutesToHours(single.extras50Minutes);
    const ex100Hs = formatMinutesToHours(single.extras100Minutes);
    const trabHs = formatMinutesToHours(single.totalTrabajoMinutes);
    const viajeHs = log.horaViaje || 0;

    result.totalViaje += viajeHs;
    result.totalTrabajo += trabHs;
    result.totalNormales += normHs;
    result.totalExtras50 += ex50Hs;
    result.totalExtras100 += ex100Hs;

    // Distribute hours to technicians assigned on log.fecha
    const techsOnDate = techs.filter((t) => t.fecha === log.fecha);

    if (techsOnDate.length === 0) {
      // Default fallback: assign to Specialist
      result.especialista.viaje += viajeHs;
      result.especialista.normales += normHs;
      result.especialista.extras50 += ex50Hs;
      result.especialista.extras100 += ex100Hs;
    } else {
      techsOnDate.forEach((t) => {
        const roleKey = t.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const count = Math.max(1, t.cantidad);
        if (roleKey.includes('especialista')) {
          result.especialista.viaje += viajeHs * count;
          result.especialista.normales += normHs * count;
          result.especialista.extras50 += ex50Hs * count;
          result.especialista.extras100 += ex100Hs * count;
        } else if (roleKey.includes('ayudante')) {
          result.ayudante.viaje += viajeHs * count;
          result.ayudante.normales += normHs * count;
          result.ayudante.extras50 += ex50Hs * count;
          result.ayudante.extras100 += ex100Hs * count;
        } else {
          result.tecnico.viaje += viajeHs * count;
          result.tecnico.normales += normHs * count;
          result.tecnico.extras50 += ex50Hs * count;
          result.tecnico.extras100 += ex100Hs * count;
        }
      });
    }
  });

  return result;
}
